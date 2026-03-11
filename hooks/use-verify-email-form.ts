import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { verifyOtpSchema } from '@/schemas/auth.schemas';
import type { VerifyOtpFormValues } from '@/schemas/auth.schemas';

const RESEND_COOLDOWN_SECONDS = 60;

export function useVerifyEmailForm(email: string) {
  const { verifyOtp, forgotPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: '' },
    mode: 'onChange',
  });

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const result = await verifyOtp({ email, code: values.code });
    if (result.success) {
      router.replace('/(main)/home');
    } else {
      setServerError(result.error ?? 'Invalid code. Please try again.');
    }
  });

  async function handleResend() {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setServerError(null);
    const result = await forgotPassword({ email });
    if (result.success) {
      setCountdown(RESEND_COOLDOWN_SECONDS);
      form.reset();
    } else {
      setServerError(result.error ?? 'Failed to resend code.');
    }
    setIsResending(false);
  }

  return {
    form,
    serverError,
    isResending,
    countdown,
    canResend: countdown <= 0,
    isLoading: form.formState.isSubmitting,
    handleSubmit,
    handleResend,
  };
}
