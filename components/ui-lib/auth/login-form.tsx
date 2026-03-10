import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { useLoginForm } from '@/hooks/use-login-form';
import { AuthSubmitButton } from './auth-submit-button';
import { FormInput } from './form-input';

const TEAL_COLOR = '#12C4BE';
const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type LoginFormProps = ReturnType<typeof useLoginForm>;

export function LoginForm({
  values,
  setValue,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  handleSubmit,
  handleGuestLogin,
}: LoginFormProps) {
  return (
    <View className="gap-4">
      {/* E-Mail — floating label variant */}
      <FormInput
        label="E-Mail"
        placeholder="you@example.com"
        value={values.email}
        onChangeText={v => setValue('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        rightIcon={<Feather name="mail" size={ICON_SIZE} color={ICON_COLOR} />}
      />

      {/* Password — no label, just placeholder dots */}
      <FormInput
        placeholder="••••••••"
        value={values.password}
        onChangeText={v => setValue('password', v)}
        secureTextEntry={!showPassword}
        autoComplete="current-password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        rightIcon={
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={ICON_SIZE}
              color={ICON_COLOR}
            />
          </Pressable>
        }
      />

      {/* Forgot Password — right-aligned */}
      <View className="items-end">
        <Link href="/(auth)/forgot-password" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text style={{ color: TEAL_COLOR }} className="text-sm">
              Forgot Password?
            </Text>
          </Button>
        </Link>
      </View>

      {/* API / validation error */}
      {error ? (
        <Text variant="small" className="text-destructive text-center">
          {error}
        </Text>
      ) : null}

      {/* Primary CTA */}
      <AuthSubmitButton
        label="Login"
        onPress={handleSubmit}
        isLoading={isLoading}
      />

      {/* Continue as Guest — outlined */}
      <Button
        variant="outline"
        onPress={handleGuestLogin}
        className="w-full h-[52px] rounded-xl border-border"
      >
        <Text className="text-foreground font-medium text-base">Continue as Guest</Text>
      </Button>

      {/* Register link */}
      <View className="flex-row items-center justify-center">
        <Text variant="muted">Don't have an account </Text>
        <Link href="/(auth)/register" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text style={{ color: TEAL_COLOR }} className="font-semibold">
              Register
            </Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
