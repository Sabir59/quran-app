import { AppContainer } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Link, router } from 'expo-router';
import { View } from 'react-native';

export default function LoginScreen() {
  // TODO: wire up form state and useAuthMutation hook
  function handleLogin() {
    router.replace('/(main)/home');
  }

  return (
    <AppContainer>
      <View className="flex-1 justify-center gap-8">

        {/* Header */}
        <View className="gap-2">
          <Text variant="h2" className='text-red-500'>Welcome back</Text>
          <Text variant="muted">Sign in to your account to continue</Text>
        </View>

        {/* Form */}
        <View className="gap-5">
          <View className="gap-1.5">
            <Label nativeID="email">Email</Label>
            <Input
              aria-labelledby="email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="gap-1.5">
            <Label nativeID="password">Password</Label>
            <Input
              aria-labelledby="password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
            />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-4">
          <Button onPress={handleLogin} className="w-full">
            <Text>Sign in</Text>
          </Button>

          <View className="flex-row items-center justify-center gap-1">
            <Text variant="muted">Don't have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <Button variant="link" size="sm">
                <Text>Sign up</Text>
              </Button>
            </Link>
          </View>
        </View>

      </View>
    </AppContainer>
  );
}
