import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { useRegisterForm } from '@/hooks/use-register-form';
import { AuthSubmitButton } from './auth-submit-button';
import { FormInput } from './form-input';

const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 20;

type RegisterFormProps = ReturnType<typeof useRegisterForm>;

export function RegisterForm({
  values,
  setValue,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  isLoading,
  error,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <View className="gap-4">
      {/* Fields */}
      <FormInput
        placeholder="Full Name"
        value={values.fullName}
        onChangeText={v => setValue('fullName', v)}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        rightIcon={<Feather name="user" size={ICON_SIZE} color={ICON_COLOR} />}
      />

      <FormInput
        placeholder="E-Mail"
        value={values.email}
        onChangeText={v => setValue('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        rightIcon={<Feather name="mail" size={ICON_SIZE} color={ICON_COLOR} />}
      />

      <FormInput
        placeholder="Enter Password"
        value={values.password}
        onChangeText={v => setValue('password', v)}
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        returnKeyType="next"
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

      <FormInput
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChangeText={v => setValue('confirmPassword', v)}
        secureTextEntry={!showConfirmPassword}
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        rightIcon={
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            accessibilityRole="button"
            accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            <Feather
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={ICON_SIZE}
              color={ICON_COLOR}
            />
          </Pressable>
        }
      />

      {/* API / validation error */}
      {error ? (
        <Text variant="small" className="text-destructive text-center">
          {error}
        </Text>
      ) : null}

      {/* Submit */}
      <AuthSubmitButton
        label="Register"
        onPress={handleSubmit}
        isLoading={isLoading}
      />

      {/* Login link */}
      <View className="flex-row items-center justify-center">
        <Text variant="muted">Don't have an account </Text>
        <Link href="/(auth)/login" asChild>
          <Button variant="link" size="sm" className="p-0 h-auto">
            <Text className="text-[#12C4BE] font-semibold">Login</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
