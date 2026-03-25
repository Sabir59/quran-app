import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/api/auth';
import type { ForgotPasswordPayload } from '@/types/auth';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
}
