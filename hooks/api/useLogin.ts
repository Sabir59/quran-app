import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}
