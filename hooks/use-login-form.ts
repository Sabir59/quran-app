import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from '@/schemas/auth.schemas';
import type { LoginFormValues } from '@/schemas/auth.schemas';

export function useLoginForm() {
  const { login, loginAsGuest } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const result = await login({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
    if (result.success) {
      router.replace('/(main)/home');
    } else {
      setServerError(result.error ?? 'Login failed. Please try again.');
    }
  });

  function handleGuestLogin() {
    loginAsGuest();
    router.replace('/(main)/home');
  }

  return {
    form,
    showPassword,
    setShowPassword,
    serverError,
    isLoading: form.formState.isSubmitting,
    handleSubmit,
    handleGuestLogin,
  };
}
