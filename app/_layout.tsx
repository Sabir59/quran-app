import '@/global.css';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { vars, useColorScheme } from 'nativewind';

import { AudioPlayerProvider, useAudioPlayer } from '@/context/AudioPlayerContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { ProgressProvider, useProgress } from '@/context/ProgressContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { SettingsProvider, useSettings } from '@/lib/settings';

const queryClient = new QueryClient();

// CSS variables for light/dark — nativewind's vars() makes them switch at runtime on native
// (global.css .dark:root doesn't switch dynamically on native, vars() does)
const lightTheme = vars({
  '--background': 'hsl(0, 0%, 100%)',
  '--foreground': 'hsl(240, 10%, 3.9%)',
  '--card': 'hsl(0, 0%, 100%)',
  '--card-foreground': 'hsl(240, 10%, 3.9%)',
  '--popover': 'hsl(0, 0%, 100%)',
  '--popover-foreground': 'hsl(240, 10%, 3.9%)',
  '--primary': 'hsl(240, 5.9%, 10%)',
  '--primary-foreground': 'hsl(0, 0%, 98%)',
  '--secondary': 'hsl(240, 4.8%, 95.9%)',
  '--secondary-foreground': 'hsl(240, 5.9%, 10%)',
  '--muted': 'hsl(240, 4.8%, 95.9%)',
  '--muted-foreground': 'hsl(240, 3.8%, 46.1%)',
  '--accent': 'hsl(240, 4.8%, 95.9%)',
  '--accent-foreground': 'hsl(240, 5.9%, 10%)',
  '--destructive': 'hsl(0, 84.2%, 60.2%)',
  '--destructive-foreground': 'hsl(0, 0%, 98%)',
  '--border': 'hsl(240, 5.9%, 90%)',
  '--input': 'hsl(240, 5.9%, 90%)',
  '--ring': 'hsl(240, 10%, 3.9%)',
});

const darkTheme = vars({
  '--background': 'hsl(240, 10%, 3.9%)',
  '--foreground': 'hsl(0, 0%, 98%)',
  '--card': 'hsl(240, 10%, 3.9%)',
  '--card-foreground': 'hsl(0, 0%, 98%)',
  '--popover': 'hsl(240, 10%, 3.9%)',
  '--popover-foreground': 'hsl(0, 0%, 98%)',
  '--primary': 'hsl(0, 0%, 98%)',
  '--primary-foreground': 'hsl(240, 5.9%, 10%)',
  '--secondary': 'hsl(240, 3.7%, 15.9%)',
  '--secondary-foreground': 'hsl(0, 0%, 98%)',
  '--muted': 'hsl(240, 3.7%, 15.9%)',
  '--muted-foreground': 'hsl(240, 5%, 64.9%)',
  '--accent': 'hsl(240, 3.7%, 15.9%)',
  '--accent-foreground': 'hsl(0, 0%, 98%)',
  '--destructive': 'hsl(0, 62.8%, 30.6%)',
  '--destructive-foreground': 'hsl(0, 0%, 98%)',
  '--border': 'hsl(240, 3.7%, 15.9%)',
  '--input': 'hsl(240, 3.7%, 15.9%)',
  '--ring': 'hsl(240, 4.9%, 83.9%)',
});

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
        playStartRef.current = Date.now();
        lastTrackKeyRef.current = trackKey;
      } else if (trackKey !== lastTrackKeyRef.current) {
        const elapsed = Math.round((Date.now() - playStartRef.current) / 1000);
        if (elapsed > 0) addListeningSeconds(elapsed);
        playStartRef.current = Date.now();
        lastTrackKeyRef.current = trackKey;
      }
    } else if (playStartRef.current) {
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
  const isDark = theme === 'dark';

  useLayoutEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setColorScheme(theme);
    } else {
      const deviceScheme = Appearance.getColorScheme() ?? 'light';
      setColorScheme(deviceScheme as 'light' | 'dark');
    }
  }, [theme, setColorScheme]);

  // Sync Android system navigation bar button style with app theme
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle(isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  if (!ready) return null;

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        {/* className="dark" activates dark: variants; vars() switches CSS custom properties */}
        <View
          style={[styles.root, isDark ? darkTheme : lightTheme]}
          className={isDark ? 'dark' : undefined}
        >
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
