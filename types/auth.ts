// ─── Payload types (API request bodies) ──────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

/** Authenticated user profile — mirrors what the NestJS backend will return */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

/**
 * A full auth session — stores what is needed to make authenticated API calls
 * and silently refresh tokens.
 *
 * SWAP NOTE: When the NestJS backend is ready:
 *   - accessToken  → real short-lived JWT (15 min)
 *   - refreshToken → long-lived opaque token stored in DB
 *   - expiresAt    → decoded from JWT `exp` claim
 *   - Store tokens in expo-secure-store instead of AsyncStorage
 */
export interface AuthSession {
  user: AuthUser;
  /** JWT access token (mock UUID for now, real JWT when backend lands) */
  accessToken: string;
  /** Refresh token — used to silently renew the access token */
  refreshToken: string;
  /** Unix timestamp (ms) when the access token expires */
  expiresAt: number;
}

/**
 * Auth state machine statuses.
 *
 * 'initializing'   → app just opened, reading persisted session from storage
 * 'unauthenticated'→ no session / explicitly logged out
 * 'authenticated'  → signed in with a real account
 * 'guest'          → using the app without an account
 */
export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated' | 'guest';

/**
 * Standard result returned by every auth action.
 * UI layer reads `success` to decide whether to navigate or show an error.
 */
export interface AuthActionResult {
  success: boolean;
  error?: string;
}
