/**
 * api/auth.ts — Auth network layer
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  THIS IS THE ONLY FILE YOU NEED TO CHANGE WHEN THE NESTJS BACKEND       │
 * │  IS READY. Replace each function body with the matching API call.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SWAP GUIDE:
 *   login          → POST /auth/login           body: { email, password }
 *   register       → POST /auth/register        body: { name, email, password }
 *   forgotPassword → POST /auth/forgot-password body: { email }
 *   verifyOtp      → POST /auth/verify-otp      body: { email, code }
 *   refreshToken   → POST /auth/refresh         body: { refreshToken }
 *   logout         → POST /auth/logout          body: { refreshToken } (optional)
 */

import type {
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from '@/types/auth';

// ─── Mock helpers (delete when swapping to real API) ──────────────────────────

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function mockUuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function buildSession(name: string, email: string, emailVerified = true): AuthSession {
  return {
    user: {
      id: mockUuid(),
      name,
      email,
      role: 'user',
      emailVerified,
      createdAt: new Date().toISOString(),
    },
    accessToken: `mock_access_${mockUuid()}`,
    refreshToken: `mock_refresh_${mockUuid()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * SWAP → POST /auth/login → returns { accessToken, refreshToken, expiresIn, user }
 * Demo error: password 'wrongpass' always fails — lets you test error UI.
 */
export async function login(payload: LoginPayload): Promise<AuthSession> {
  await delay(900);
  if (payload.password === 'wrongpass') {
    throw new Error('Invalid email or password.');
  }
  return buildSession(nameFromEmail(payload.email), payload.email);
}

/**
 * SWAP → POST /auth/register → returns { message: 'OTP sent to email' }
 * Real API may throw if email is already registered.
 */
export async function register(payload: RegisterPayload): Promise<{ email: string }> {
  await delay(1000);
  return { email: payload.email };
}

/**
 * SWAP → POST /auth/forgot-password → returns { message: 'OTP sent' }
 * Real API may throw if email is not found.
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await delay(700);
  void payload;
}

/**
 * SWAP → POST /auth/verify-otp → returns { accessToken, refreshToken, expiresIn, user }
 * Demo error: code '000000' always fails — lets you test error UI.
 */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<AuthSession> {
  await delay(800);
  if (payload.code === '000000') {
    throw new Error('Invalid verification code. Please try again.');
  }
  return buildSession(nameFromEmail(payload.email), payload.email, true);
}

/**
 * SWAP → POST /auth/refresh → returns { accessToken, refreshToken, expiresIn }
 * Called by the API client interceptor when a 401 is received.
 */
export async function refreshToken(token: string): Promise<{ accessToken: string; expiresAt: number }> {
  await delay(300);
  void token;
  return {
    accessToken: `mock_access_${mockUuid()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

/**
 * SWAP → POST /auth/logout body: { refreshToken } (invalidates server-side)
 */
export async function logout(): Promise<void> {
  await delay(200);
}
