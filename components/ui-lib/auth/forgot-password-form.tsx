import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { useForgotPasswordForm } from '@/hooks/use-forgot-password-form';
import { AuthSubmitButton } from './auth-submit-button';
import { FormInput } from './form-input';

const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type ForgotPasswordFormProps = ReturnType<typeof useForgotPasswordForm>;

export function ForgotPasswordForm({
  email,
  handleEmailChange,
  isLoading,
  error,
  handleSubmit,
}: ForgotPasswordFormProps) {
  return (
    <View className="gap-4">
      <FormInput
        label="E-Mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        rightIcon={<Feather name="mail" size={ICON_SIZE} color={ICON_COLOR} />}
      />

      {error ? (
        <Text variant="small" className="text-destructive text-center">
          {error}
        </Text>
      ) : null}

      <AuthSubmitButton
        label="Send Verification Code"
        onPress={handleSubmit}
        isLoading={isLoading}
      />

      {/* Back to Login */}
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
