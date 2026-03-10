import { router } from 'expo-router';
import { useState } from 'react';
import type { ForgotPasswordPayload } from '@/types/auth';

// TODO: import { forgotPassword } from '@/api/user/auth';

function validate(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address.';
  return null;
}

export function useForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    if (error) setError(null);
  }

  async function handleSubmit() {
    const validationError = validate(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload: ForgotPasswordPayload = {
        email: email.trim().toLowerCase(),
      };

      // TODO: await forgotPassword(payload);
      console.log('[useForgotPasswordForm] Payload ready for backend:', payload);

      // Navigate to OTP screen, passing the email as a param
      router.push({ pathname: '/(auth)/verify-email', params: { email: payload.email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    email,
    handleEmailChange,
    isLoading,
    error,
    handleSubmit,
  };
}
