import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { registerSchema } from '@/schemas/auth.schemas';
import type { RegisterFormValues } from '@/schemas/auth.schemas';

export function useRegisterForm() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const result = await register({
      name: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
    if (result.success && result.email) {
      router.push({ pathname: '/(auth)/verify-email', params: { email: result.email } });
    } else {
      setServerError(result.error ?? 'Registration failed. Please try again.');
    }
  });

  return {
    form,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    serverError,
    isLoading: form.formState.isSubmitting,
    handleSubmit,
  };
}
