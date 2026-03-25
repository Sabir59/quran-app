import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/api/useLogin';
import { loginSchema } from '@/schemas/auth.schemas';
import type { LoginFormValues } from '@/schemas/auth.schemas';

export function useLoginForm() {
  const { loginAsGuest } = useAuth();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await loginMutation.mutateAsync({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.replace('/(main)/home');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.');
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
    isLoading: loginMutation.isPending,
    handleSubmit,
    handleGuestLogin,
  };
}
