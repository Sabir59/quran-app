import { useState } from 'react';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/api/useRegister';
import { registerSchema } from '@/schemas/auth.schemas';
import type { RegisterFormValues } from '@/schemas/auth.schemas';

export function useRegisterForm() {
  const registerMutation = useRegister();
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
    try {
      const { email } = await registerMutation.mutateAsync({
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  });

  return {
    form,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    serverError,
    isLoading: registerMutation.isPending,
    handleSubmit,
  };
}
