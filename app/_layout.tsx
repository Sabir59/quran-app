import '@/global.css';
import { SettingsProvider, useSettings } from '@/lib/settings';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AudioPlayerProvider>
          <ThemedNav>
            <View style={styles.root}>
              <Stack screenOptions={{ headerShown: false }} />
              <MiniPlayer />
            </View>
          </ThemedNav>
        </AudioPlayerProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

const queryClient = new QueryClient();

function ThemedNav({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { theme } = useSettings();
  const effective = theme === 'system' ? systemScheme : theme;
  return (
    <ThemeProvider value={effective === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
