import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { verifyOtp } from '@/api/auth';
import type { VerifyOtpPayload } from '@/types/auth';

export function useVerifyOtp() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: (session) => setSession(session),
  });
}
