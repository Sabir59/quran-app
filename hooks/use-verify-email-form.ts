import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import type { VerifyOtpPayload } from '@/types/auth';

// TODO: import { verifyOtp } from '@/api/user/auth';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export function useVerifyEmailForm(email: string) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);

  // Countdown timer — ticks down each second until 0
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleCodeChange(value: string) {
    // Only allow digits, max OTP_LENGTH characters
    const clean = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(clean);
    if (error) setError(null);
  }

  async function handleSubmit() {
    if (code.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload: VerifyOtpPayload = { email, code };

      // TODO: await verifyOtp(payload);
      console.log('[useVerifyEmailForm] Payload ready for backend:', payload);

      // TODO: router.replace('/(auth)/reset-password') or router.replace('/(auth)/login')
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      // TODO: await forgotPassword({ email });
      console.log('[useVerifyEmailForm] Resend OTP for:', email);

      // Reset countdown
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  }

  return {
    code,
    handleCodeChange,
    isLoading,
    isResending,
    error,
    countdown,
    canResend: countdown <= 0,
    handleSubmit,
    handleResend,
  };
}
