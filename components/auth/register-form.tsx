import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import type { useRegisterForm } from '@/hooks/use-register-form';

const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type RegisterFormProps = ReturnType<typeof useRegisterForm>;

export function RegisterForm({
  form,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  serverError,
  isLoading,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="fullName"
        render={({ field, fieldState }) => (
          <FormInput
            placeholder="Full Name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            error={fieldState.error?.message}
            rightIcon={<Ionicons name="person-outline" size={ICON_SIZE} color={ICON_COLOR} />}
          />
        )}
      />

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <FormInput
            placeholder="E-Mail"
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

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <FormInput
            placeholder="Enter Password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            returnKeyType="next"
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

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <FormInput
            placeholder="Confirm Password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={fieldState.error?.message}
            rightIcon={
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityRole="button"
                accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={ICON_SIZE} color={ICON_COLOR} />
              </Pressable>
            }
          />
        )}
      />

      {serverError ? (
        <Text variant="small" className="text-destructive text-center">{serverError}</Text>
      ) : null}

      <AuthSubmitButton label="Register" onPress={handleSubmit} isLoading={isLoading} />

      <View className="flex-row items-center justify-center">
        <Text variant="muted">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text className="text-[#12C4BE] font-semibold">Login</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
