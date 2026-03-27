import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/hooks/api/useForgotPassword';
import { forgotPasswordSchema } from '@/schemas/auth.schemas';
import type { ForgotPasswordFormValues } from '@/schemas/auth.schemas';

export function useForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await forgotPasswordMutation.mutateAsync({ email: values.email.trim().toLowerCase() });
      setEmailSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    }
  });

  return {
    form,
    serverError,
    emailSent,
    isLoading: forgotPasswordMutation.isPending,
    handleSubmit,
  };
}
