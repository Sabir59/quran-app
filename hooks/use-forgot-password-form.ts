import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/hooks/api/useForgotPassword';
import { forgotPasswordSchema } from '@/schemas/auth.schemas';
import type { ForgotPasswordFormValues } from '@/schemas/auth.schemas';

export function useForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const email = values.email.trim().toLowerCase();
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      router.push({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    }
  });

  return {
    form,
    serverError,
    isLoading: forgotPasswordMutation.isPending,
    handleSubmit,
  };
}
