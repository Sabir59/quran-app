/**
 * AuthContext.tsx — Global auth state machine
 *
 * Provides auth state and actions to the entire app.
 * All navigation logic lives in the form hooks / AuthGuard, not here.
 * This file never needs to change when the backend is plugged in — only
 * services/authService.ts changes.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { authService, loadPersistedSession } from '@/services/authService';
import type {
  AuthActionResult,
  AuthSession,
  AuthStatus,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from '@/types/auth';

// ─── State ────────────────────────────────────────────────────────────────────

interface State {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
}

const INITIAL_STATE: State = {
  status: 'initializing',
  user: null,
  session: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_SESSION'; payload: AuthSession }
  | { type: 'SET_GUEST' }
  | { type: 'SET_UNAUTHENTICATED' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        status: 'authenticated',
        user: action.payload.user,
        session: action.payload,
      };
    case 'SET_GUEST':
      return { status: 'guest', user: null, session: null };
    case 'SET_UNAUTHENTICATED':
      return { status: 'unauthenticated', user: null, session: null };
    default:
      return state;
  }
}

// ─── Context interface ────────────────────────────────────────────────────────

interface AuthContextValue {
  // ── Derived state ──
  status: AuthStatus;
  user: AuthUser | null;
  /** true while reading the persisted session on app start */
  isInitializing: boolean;
  /** true when signed in with a real account */
  isAuthenticated: boolean;
  /** true when using the app without an account */
  isGuest: boolean;

  // ── Actions ──
  /** Sign in. Returns { success, error } — navigate on success in the caller. */
  login: (payload: LoginPayload) => Promise<AuthActionResult>;

  /**
   * Create a new account.
   * Returns { success, email } — navigate to OTP screen on success.
   */
  register: (payload: RegisterPayload) => Promise<AuthActionResult & { email?: string }>;

  /** Enter the app without signing in. Navigates immediately (no async). */
  loginAsGuest: () => void;

  /** Request a password-reset OTP. Navigate to OTP screen on success. */
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<AuthActionResult>;

  /**
   * Verify a 6-digit OTP (registration OR password reset).
   * On success, session is set and the user is authenticated.
   */
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AuthActionResult>;

  /** Sign out and clear all local session data. */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Restore persisted session on app start
  useEffect(() => {
    loadPersistedSession()
      .then(session => {
        if (session) {
          dispatch({ type: 'SET_SESSION', payload: session });
        } else {
          dispatch({ type: 'SET_UNAUTHENTICATED' });
        }
      })
      .catch(() => {
        dispatch({ type: 'SET_UNAUTHENTICATED' });
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<AuthActionResult> => {
    try {
      const session = await authService.login(payload);
      dispatch({ type: 'SET_SESSION', payload: session });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Login failed. Please try again.',
      };
    }
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthActionResult & { email?: string }> => {
      try {
        const { email } = await authService.register(payload);
        // Don't set session yet — user must verify OTP first
        return { success: true, email };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Registration failed. Please try again.',
        };
      }
    },
    [],
  );

  const loginAsGuest = useCallback(() => {
    dispatch({ type: 'SET_GUEST' });
  }, []);

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload): Promise<AuthActionResult> => {
      try {
        await authService.forgotPassword(payload);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to send code. Please try again.',
        };
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (payload: VerifyOtpPayload): Promise<AuthActionResult> => {
      try {
        const session = await authService.verifyOtp(payload);
        dispatch({ type: 'SET_SESSION', payload: session });
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Invalid code. Please try again.',
        };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'SET_UNAUTHENTICATED' });
  }, []);

  const value: AuthContextValue = {
    status: state.status,
    user: state.user,
    isInitializing: state.status === 'initializing',
    isAuthenticated: state.status === 'authenticated',
    isGuest: state.status === 'guest',
    login,
    register,
    loginAsGuest,
    forgotPassword,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}
