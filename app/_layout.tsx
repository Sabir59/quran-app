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
// Runs a 10-second tick whenever audio is playing, crediting listening time.

function AudioProgressBridge() {
  const { isPlaying } = useAudioPlayer();
  const { addListeningSeconds } = useProgress();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        addListeningSeconds(10);
      }, 10_000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, addListeningSeconds]);

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
