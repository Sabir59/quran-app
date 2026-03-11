/**
 * authService.ts — Auth service layer
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  THIS IS THE ONLY FILE YOU NEED TO CHANGE WHEN THE NESTJS BACKEND       │
 * │  IS READY. Replace each function body with the matching API call.       │
 * │  Function signatures must stay the same — AuthContext depends on them.  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SWAP GUIDE (per function):
 *   login         → POST /auth/login        body: { email, password }
 *   register      → POST /auth/register     body: { name, email, password }
 *   forgotPassword→ POST /auth/forgot-password body: { email }
 *   verifyOtp     → POST /auth/verify-otp   body: { email, code }
 *   refreshAccessToken → POST /auth/refresh body: { refreshToken }
 *   logout        → POST /auth/logout       body: { refreshToken } (optional)
 *
 * TOKEN STORAGE SWAP:
 *   Currently uses AsyncStorage (no real JWTs yet).
 *   When real JWTs arrive → switch to expo-secure-store:
 *     import * as SecureStore from 'expo-secure-store';
 *     persistSession  → SecureStore.setItemAsync(key, value)
 *     loadSession     → SecureStore.getItemAsync(key)
 *     clearSession    → SecureStore.deleteItemAsync(key)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from '@/types/auth';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const SESSION_KEY = '@quran_app/auth_session';

// ─── Session persistence helpers ──────────────────────────────────────────────

export async function persistSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function loadPersistedSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: AuthSession = JSON.parse(raw);

    // Access token expired → clear and treat as unauthenticated
    if (Date.now() > session.expiresAt) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function clearPersistedSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ─── Mock helpers (remove when swapping to real API) ─────────────────────────

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
    // 7-day expiry — generous for mock / dev
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Login with email + password.
   * SWAP → POST /auth/login → returns { accessToken, refreshToken, expiresIn, user }
   */
  async login(payload: LoginPayload): Promise<AuthSession> {
    await delay(900);

    // Demo error: password 'wrongpass' always fails — lets you test error UI
    if (payload.password === 'wrongpass') {
      throw new Error('Invalid email or password.');
    }

    const name = nameFromEmail(payload.email);
    const session = buildSession(name, payload.email);
    await persistSession(session);
    return session;
  },

  /**
   * Register a new account.
   * SWAP → POST /auth/register → returns { message: 'OTP sent to email' }
   * We return just the email because OTP verification is the next step.
   */
  async register(payload: RegisterPayload): Promise<{ email: string }> {
    await delay(1000);
    // Mock: always succeeds. Real API may throw if email already registered.
    return { email: payload.email };
  },

  /**
   * Request a password-reset OTP.
   * SWAP → POST /auth/forgot-password → returns { message: 'OTP sent' }
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await delay(700);
    // Mock: always succeeds. Real API may throw if email not found.
    void payload;
  },

  /**
   * Verify a 6-digit OTP.
   * Used for both email verification after registration AND password reset.
   * SWAP → POST /auth/verify-otp → returns { accessToken, refreshToken, expiresIn, user }
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthSession> {
    await delay(800);

    // Demo error: code '000000' always fails — lets you test error UI
    if (payload.code === '000000') {
      throw new Error('Invalid verification code. Please try again.');
    }

    const name = nameFromEmail(payload.email);
    const session = buildSession(name, payload.email, true);
    await persistSession(session);
    return session;
  },

  /**
   * Silently refresh the access token using the stored refresh token.
   * SWAP → POST /auth/refresh → returns { accessToken, refreshToken, expiresIn }
   * Called automatically by the API client interceptor when a 401 is received.
   */
  async refreshAccessToken(_refreshToken: string): Promise<AuthSession | null> {
    // Mock: just extend the stored session with a new token
    const stored = await loadPersistedSession();
    if (!stored) return null;

    const refreshed: AuthSession = {
      ...stored,
      accessToken: `mock_access_${mockUuid()}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    await persistSession(refreshed);
    return refreshed;
  },

  /**
   * Logout — revoke tokens and clear local session.
   * SWAP → POST /auth/logout body: { refreshToken } (invalidates server-side)
   */
  async logout(): Promise<void> {
    await delay(200);
    await clearPersistedSession();
  },
};
