import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import type { useForgotPasswordForm } from '@/hooks/use-forgot-password-form';

const TEAL_COLOR = '#12C4BE';
const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type ForgotPasswordFormProps = ReturnType<typeof useForgotPasswordForm>;

export function ForgotPasswordForm({
  form,
  serverError,
  emailSent,
  isLoading,
  handleSubmit,
}: ForgotPasswordFormProps) {
  if (emailSent) {
    return (
      <View className="gap-6">
        <View className="gap-2">
          <Text variant="h3" className="text-foreground font-bold">Check Your Email</Text>
          <Text variant="muted" className="leading-5">
            A password reset link has been sent to{' '}
            <Text style={{ color: TEAL_COLOR }} className="font-semibold">
              {form.getValues('email')}
            </Text>
            .{'\n'}Follow the link in the email to reset your password.
          </Text>
        </View>

        <Link href="/(auth)/login" asChild>
          <Button className="w-full h-[52px] rounded-xl" style={{ backgroundColor: TEAL_COLOR }}>
            <Text className="text-white font-semibold text-base">Back to Login</Text>
          </Button>
        </Link>
      </View>
    );
  }

  return (
    <View className="gap-4">
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
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={fieldState.error?.message}
            rightIcon={<Ionicons name="mail-outline" size={ICON_SIZE} color={ICON_COLOR} />}
          />
        )}
      />

      {serverError ? (
        <Text variant="small" className="text-destructive text-center">{serverError}</Text>
      ) : null}

      <AuthSubmitButton label="Send Reset Link" onPress={handleSubmit} isLoading={isLoading} />

      <View className="flex-row items-center justify-center">
        <Text variant="muted">Remember your password? </Text>
        <Link href="/(auth)/login" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text style={{ color: TEAL_COLOR }} className="font-semibold">Login</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
