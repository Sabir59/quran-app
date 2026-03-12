import '@/global.css';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Appearance, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { AudioPlayerProvider, useAudioPlayer } from '@/context/AudioPlayerContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { ProgressProvider, useProgress } from '@/context/ProgressContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { SettingsProvider, useSettings } from '@/lib/settings';

const queryClient = new QueryClient();

// ─── Root layout — provider shell only ───────────────────────────────────────

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <BookmarksProvider>
            <ProgressProvider>
              <AudioPlayerProvider>
                <ThemedApp />
              </AudioPlayerProvider>
            </ProgressProvider>
          </BookmarksProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

// ─── Audio → Progress bridge ──────────────────────────────────────────────────
// Uses timestamps to credit listening time accurately on play/pause/track change.

function AudioProgressBridge() {
  const { isPlaying, currentTrack } = useAudioPlayer();
  const { addListeningSeconds } = useProgress();
  const playStartRef = useRef<number | null>(null);
  const lastTrackKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const trackKey = currentTrack
      ? `${currentTrack.surahNumber}-${currentTrack.ayahNumber}`
      : null;

    if (isPlaying) {
      if (!playStartRef.current) {
        // Started playing
        playStartRef.current = Date.now();
        lastTrackKeyRef.current = trackKey;
      } else if (trackKey !== lastTrackKeyRef.current) {
        // Track changed while playing — credit elapsed for previous
        const elapsed = Math.round((Date.now() - playStartRef.current) / 1000);
        if (elapsed > 0) addListeningSeconds(elapsed);
        playStartRef.current = Date.now();
        lastTrackKeyRef.current = trackKey;
      }
    } else if (playStartRef.current) {
      // Paused/stopped — credit elapsed
      const elapsed = Math.round((Date.now() - playStartRef.current) / 1000);
      if (elapsed > 0) addListeningSeconds(elapsed);
      playStartRef.current = null;
      lastTrackKeyRef.current = null;
    }
  }, [isPlaying, currentTrack?.surahNumber, currentTrack?.ayahNumber, addListeningSeconds]);

  useEffect(() => {
    return () => {
      if (playStartRef.current) {
        const elapsed = Math.round((Date.now() - playStartRef.current) / 1000);
        if (elapsed > 0) addListeningSeconds(elapsed);
      }
    };
  }, [addListeningSeconds]);

  return null;
}

// ─── Theme + guard wrapper ────────────────────────────────────────────────────

function ThemedApp() {
  const { setColorScheme } = useColorScheme();
  const { theme, ready } = useSettings();

  // useLayoutEffect fires synchronously before paint — no flash between renders
  // Android's AppearanceModule crashes if it receives null ('system' maps to null internally)
  // so we resolve 'system' → actual device scheme before calling setColorScheme.
  useLayoutEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setColorScheme(theme);
    } else {
      const deviceScheme = Appearance.getColorScheme() ?? 'light';
      setColorScheme(deviceScheme as 'light' | 'dark');
    }
  }, [theme, setColorScheme]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        <View style={styles.root}>
          <Stack screenOptions={{ headerShown: false }} />
          <MiniPlayer />
          <AudioProgressBridge />
        </View>
      </AuthGuard>
    </ThemeProvider>
  );
}

// ─── Auth guard ───────────────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'initializing') return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthed = status === 'authenticated' || status === 'guest';

    if (isAuthed && inAuthGroup) {
      router.replace('/(main)/home');
    } else if (!isAuthed && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [status, segments]);

  return <>{children}</>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
});
