import { useState } from 'react';
import type { RegisterFormValues, RegisterPayload } from '@/types/auth';

// TODO: import { registerUser } from '@/api/user/auth';
// TODO: import { router } from 'expo-router';

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(values: RegisterFormValues): string | null {
  if (!values.fullName.trim()) return 'Full name is required.';
  if (!values.email.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(values.email)) return 'Enter a valid email address.';
  if (!values.password) return 'Password is required.';
  if (values.password.length < 8) return 'Password must be at least 8 characters.';
  if (values.password !== values.confirmPassword) return 'Passwords do not match.';
  return null;
}

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setValue<K extends keyof RegisterFormValues>(key: K, value: string) {
    setValues(prev => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  async function handleSubmit() {
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload: RegisterPayload = {
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      // TODO: await registerUser(payload);
      // TODO: router.replace('/(main)/home');
      console.log('[useRegisterForm] Payload ready for backend:', payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    values,
    setValue,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
