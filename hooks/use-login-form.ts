import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/api/useLogin';
import { googleSignIn } from '@/api/auth';
import { loginSchema } from '@/schemas/auth.schemas';
import type { LoginFormValues } from '@/schemas/auth.schemas';

const GOOGLE_WEB_CLIENT_ID =
  '530346082853-kja361u0et7mkfh34s1h9pnd3c8g8ee5.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID =
  '530346082853-s4l602todk09uguqp958f9umnrnb4i1r.apps.googleusercontent.com';

export function useLoginForm() {
  const { loginAsGuest } = useAuth();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  async function handleGuestLogin() {
    await loginAsGuest();
    router.replace('/(main)/home');
  }

  async function handleGoogleSignIn() {
    setServerError(null);
    setIsGoogleLoading(true);
    try {
      // Dynamically load — only works in EAS dev/production builds, not Expo Go
      const mod = require('@react-native-google-signin/google-signin');
      const GoogleSignin = mod.GoogleSignin;
      const statusCodes = mod.statusCodes;

      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken ?? userInfo?.idToken;
      if (!idToken) throw new Error('Google sign-in did not return an ID token.');
      await googleSignIn(idToken);
      router.replace('/(main)/home');
    } catch (err: any) {
      if (err?.code === 'SIGN_IN_CANCELLED' || err?.code === 'IN_PROGRESS') {
        // user cancelled — do nothing
      } else {
        setServerError(
          err instanceof Error ? err.message : 'Google sign-in failed.',
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return {
    form,
    showPassword,
    setShowPassword,
    serverError,
    isLoading: loginMutation.isPending,
    isGoogleLoading,
    handleSubmit,
    handleGuestLogin,
    handleGoogleSignIn,
  };
}
