import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth';
import type { RegisterPayload } from '@/types/auth';

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}
