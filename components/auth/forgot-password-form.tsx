import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import type { useForgotPasswordForm } from '@/hooks/use-forgot-password-form';

const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type ForgotPasswordFormProps = ReturnType<typeof useForgotPasswordForm>;

export function ForgotPasswordForm({
  form,
  serverError,
  isLoading,
  handleSubmit,
}: ForgotPasswordFormProps) {
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

      <AuthSubmitButton label="Send Verification Code" onPress={handleSubmit} isLoading={isLoading} />

      <View className="flex-row items-center justify-center">
        <Text variant="muted">Remember your password? </Text>
        <Link href="/(auth)/login" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text className="text-[#12C4BE] font-semibold">Login</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
