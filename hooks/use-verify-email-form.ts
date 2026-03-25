import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVerifyOtp } from '@/hooks/api/useVerifyOtp';
import { useForgotPassword } from '@/hooks/api/useForgotPassword';
import { verifyOtpSchema } from '@/schemas/auth.schemas';
import type { VerifyOtpFormValues } from '@/schemas/auth.schemas';

const RESEND_COOLDOWN_SECONDS = 60;

export function useVerifyEmailForm(email: string) {
  const verifyOtpMutation = useVerifyOtp();
  const forgotPasswordMutation = useForgotPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await verifyOtpMutation.mutateAsync({ email, code: values.code });
      router.replace('/(main)/home');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    }
  });

  async function handleResend() {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setServerError(null);
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setCountdown(RESEND_COOLDOWN_SECONDS);
      form.reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to resend code.');
    }
    setIsResending(false);
  }

  return {
    form,
    serverError,
    isResending,
    countdown,
    canResend: countdown <= 0,
    isLoading: verifyOtpMutation.isPending,
    handleSubmit,
    handleResend,
  };
}
