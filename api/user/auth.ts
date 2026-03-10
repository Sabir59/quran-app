import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, VerifyOtpPayload } from '@/types/auth';

// TODO: Uncomment and configure when NestJS backend is ready:
// import { createApiClient } from '@/api/config/createApiClient';
// const authClient = createApiClient(process.env.EXPO_PUBLIC_API_BASE_URL ?? '');

/**
 * Register a new user.
 * Integration point: POST /auth/register
 *
 * @param payload - { name, email, password }
 */
export async function registerUser(_payload: RegisterPayload): Promise<void> {
  // TODO: return authClient.post('/auth/register', payload);
  throw new Error('Auth API not yet implemented. Wire up NestJS endpoint here.');
}

/**
 * Log in an existing user.
 * Integration point: POST /auth/login
 */
export async function loginUser(_payload: LoginPayload): Promise<void> {
  // TODO: return authClient.post('/auth/login', payload);
  throw new Error('Auth API not yet implemented. Wire up NestJS endpoint here.');
}

/**
 * Send OTP to the user's email for password reset.
 * Integration point: POST /auth/forgot-password
 */
export async function forgotPassword(_payload: ForgotPasswordPayload): Promise<void> {
  // TODO: return authClient.post('/auth/forgot-password', payload);
  throw new Error('Auth API not yet implemented. Wire up NestJS endpoint here.');
}

/**
 * Verify the OTP code sent to the user's email.
 * Integration point: POST /auth/verify-otp
 */
export async function verifyOtp(_payload: VerifyOtpPayload): Promise<void> {
  // TODO: return authClient.post('/auth/verify-otp', payload);
  throw new Error('Auth API not yet implemented. Wire up NestJS endpoint here.');
}
