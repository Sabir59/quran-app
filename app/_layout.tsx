import '@/global.css';

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { SettingsProvider, useSettings } from '@/lib/settings';

const queryClient = new QueryClient();

// ─── Root layout — provider shell only ───────────────────────────────────────
// No hooks here — providers must wrap everything before any hook runs.

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <BookmarksProvider>
            <AudioPlayerProvider>
              <ThemedApp />
            </AudioPlayerProvider>
          </BookmarksProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

// ─── Theme + guard wrapper ────────────────────────────────────────────────────

function ThemedApp() {
  const { colorScheme } = useColorScheme();
  const { theme } = useSettings();
  const effective = theme === 'system' ? colorScheme : theme;

  return (
    <ThemeProvider value={effective === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        <View style={styles.root}>
          <Stack screenOptions={{ headerShown: false }} />
          <MiniPlayer />
        </View>
      </AuthGuard>
    </ThemeProvider>
  );
}

// ─── Auth guard — route protection ───────────────────────────────────────────
/**
 * Watches auth status and redirects whenever it changes:
 *   authenticated / guest  + auth group screen   → push to home
 *   unauthenticated        + non-auth screen      → push to login
 *
 * 'initializing' is skipped — index.tsx shows a loading screen during that window.
 */
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
  root: {
    flex: 1,
  },
});
