import { useMutation } from '@tanstack/react-query';
import type { VerifyOtpPayload } from '@/types/auth';

// OTP verification is not used in the Firebase auth flow.
// This hook is kept as a stub for compatibility.
export function useVerifyOtp() {
  return useMutation({
    mutationFn: (_payload: VerifyOtpPayload) => Promise.resolve(),
  });
}
