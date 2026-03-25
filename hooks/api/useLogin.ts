import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/api/auth';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (session) => setSession(session),
  });
}
