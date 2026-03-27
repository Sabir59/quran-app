import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import type { useLoginForm } from '@/hooks/use-login-form';

const TEAL_COLOR = '#12C4BE';
const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type LoginFormProps = ReturnType<typeof useLoginForm>;

export function LoginForm({
  form,
  showPassword,
  setShowPassword,
  serverError,
  isLoading,
  isGoogleLoading,
  handleSubmit,
  handleGuestLogin,
  handleGoogleSignIn,
}: LoginFormProps) {
  const busy = isLoading || isGoogleLoading;

  return (
    <View className="gap-4">
      {/* Email */}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormInput
            label="E-Mail"
            placeholder="you@example.com"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            error={fieldState.error?.message}
            rightIcon={<Ionicons name="mail-outline" size={ICON_SIZE} color={ICON_COLOR} />}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <FormInput
            placeholder="••••••••"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            secureTextEntry={!showPassword}
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={fieldState.error?.message}
            rightIcon={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={ICON_SIZE} color={ICON_COLOR} />
              </Pressable>
            }
          />
        )}
      />

      {/* Forgot password */}
      <View className="items-end">
        <Link href="/(auth)/forgot-password" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text style={{ color: TEAL_COLOR }} className="text-sm">Forgot Password?</Text>
          </Button>
        </Link>
      </View>

      {/* Server error */}
      {serverError ? (
        <Text variant="small" className="text-destructive text-center">{serverError}</Text>
      ) : null}

      <AuthSubmitButton label="Login" onPress={handleSubmit} isLoading={isLoading} disabled={busy} />

      {/* Continue as Guest */}
      <Button variant="outline" onPress={handleGuestLogin} disabled={busy} className="w-full h-[52px] rounded-xl border-border">
        <Text className="text-foreground font-medium text-base">Continue as Guest</Text>
      </Button>

      {/* Register link */}
      <View className="flex-row items-center justify-center">
        <Text variant="muted">{"Don't have an account "}</Text>
        <Link href="/(auth)/register" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text style={{ color: TEAL_COLOR }} className="font-semibold">Register</Text>
          </Button>
        </Link>
      </View>

      {/* Divider */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-border" />
        <Text variant="muted" className="text-xs">or continue with</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* Google Sign-In */}
      <Pressable
        onPress={handleGoogleSignIn}
        disabled={busy}
        className="flex-row items-center justify-center gap-3 h-[52px] rounded-xl border border-border bg-card"
        style={({ pressed }) => ({ opacity: pressed || busy ? 0.65 : 1 })}
      >
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color={TEAL_COLOR} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className="text-foreground font-semibold text-base">Google</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
