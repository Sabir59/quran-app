import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { forgotPasswordSchema } from '@/schemas/auth.schemas';
import type { ForgotPasswordFormValues } from '@/schemas/auth.schemas';

export function useForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const result = await forgotPassword({ email: values.email.trim().toLowerCase() });
    if (result.success) {
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: values.email.trim().toLowerCase() },
      });
    } else {
      setServerError(result.error ?? 'Failed to send code. Please try again.');
    }
  });

  return {
    form,
    serverError,
    isLoading: form.formState.isSubmitting,
    handleSubmit,
  };
}
