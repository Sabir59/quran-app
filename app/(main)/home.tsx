import { AppContainer } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  // TODO: wire up useUser hook and quran data hooks
  function handleLogout() {
    router.replace('/(auth)/login');
  }

  return (
    <AppContainer>
      <View className="flex-1 gap-8">

        {/* Header */}
        <View className="gap-1">
          <Text variant="h3">Assalamu Alaikum</Text>
          <Text variant="muted">Continue your Quran journey</Text>
        </View>

        {/* Placeholder content */}
        <View className="flex-1 gap-4">
          {/* TODO: replace with real Quran content cards */}
          <View className="rounded-lg border border-border bg-card p-5">
            <Text variant="large">Daily Verse</Text>
            <Text variant="muted" className="mt-1">Your verse for today will appear here</Text>
          </View>

          <View className="rounded-lg border border-border bg-card p-5">
            <Text variant="large">Last Read</Text>
            <Text variant="muted" className="mt-1">Resume where you left off</Text>
          </View>

          <View className="rounded-lg border border-border bg-card p-5">
            <Text variant="large">Memorization Progress</Text>
            <Text variant="muted" className="mt-1">Track your memorization goals</Text>
          </View>
        </View>

        {/* Logout placeholder */}
        <Button variant="outline" onPress={handleLogout}>
          <Text>Sign out</Text>
        </Button>

      </View>
    </AppContainer>
  );
}
