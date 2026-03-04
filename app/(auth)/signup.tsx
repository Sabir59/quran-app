import { AppContainer } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Link, router } from 'expo-router';
import { View } from 'react-native';

export default function SignupScreen() {
  // TODO: wire up form state and useRegisterMutation hook
  function handleSignup() {
    router.replace('/(main)/home');
  }

  return (
    <AppContainer>
      <View className="flex-1 justify-center gap-8">

        {/* Header */}
        <View className="gap-2">
          <Text variant="h2">Create account</Text>
          <Text variant="muted">Enter your details to get started</Text>
        </View>

        {/* Form */}
        <View className="gap-5">
          <View className="gap-1.5">
            <Label nativeID="name">Full name</Label>
            <Input
              aria-labelledby="name"
              placeholder="Ahmad Abdullah"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

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
              autoComplete="new-password"
            />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-4">
          <Button onPress={handleSignup} className="w-full">
            <Text>Create account</Text>
          </Button>

          <View className="flex-row items-center justify-center gap-1">
            <Text variant="muted">Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <Button variant="link" size="sm">
                <Text>Sign in</Text>
              </Button>
            </Link>
          </View>
        </View>

      </View>
    </AppContainer>
  );
}
