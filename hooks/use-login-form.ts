import { useState } from 'react';
import type { LoginFormValues, LoginPayload } from '@/types/auth';

// TODO: import { loginUser } from '@/api/user/auth';
// TODO: import { router } from 'expo-router';

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

function validate(values: LoginFormValues): string | null {
  if (!values.email.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(values.email)) return 'Enter a valid email address.';
  if (!values.password) return 'Password is required.';
  return null;
}

export function useLoginForm() {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setValue<K extends keyof LoginFormValues>(key: K, value: string) {
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
      const payload: LoginPayload = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      // TODO: await loginUser(payload);
      // TODO: router.replace('/(main)/home');
      console.log('[useLoginForm] Payload ready for backend:', payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleGuestLogin() {
    // TODO: router.replace('/(main)/home');
    console.log('[useLoginForm] Guest login requested');
  }

  return {
    values,
    setValue,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    handleSubmit,
    handleGuestLogin,
  };
}
