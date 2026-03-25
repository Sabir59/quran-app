/**
 * AuthContext.tsx — Global auth state machine
 *
 * Owns auth state and session persistence only.
 * Network calls live in api/auth.ts.
 * Mutations (login, register, OTP, forgotPassword) live in hooks/api/.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import type {
  AuthSession,
  AuthStatus,
  AuthUser,
} from '@/types/auth';

// ─── Session storage ──────────────────────────────────────────────────────────

const SESSION_KEY = '@quran_app/auth_session';

async function persistSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function loadPersistedSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

async function clearPersistedSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

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
  status: AuthStatus;
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  /** Called by mutation hooks after a successful login / OTP verify. */
  setSession: (session: AuthSession) => Promise<void>;
  /** Enter the app without signing in. */
  loginAsGuest: () => void;
  /** Sign out and clear all local session data. */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    loadPersistedSession()
      .then(session => {
        dispatch(session ? { type: 'SET_SESSION', payload: session } : { type: 'SET_UNAUTHENTICATED' });
      })
      .catch(() => dispatch({ type: 'SET_UNAUTHENTICATED' }));
  }, []);

  const setSession = useCallback(async (session: AuthSession) => {
    await persistSession(session);
    dispatch({ type: 'SET_SESSION', payload: session });
  }, []);

  const loginAsGuest = useCallback(() => {
    dispatch({ type: 'SET_GUEST' });
  }, []);

  const logout = useCallback(async () => {
    await clearPersistedSession();
    dispatch({ type: 'SET_UNAUTHENTICATED' });
  }, []);

  const value: AuthContextValue = {
    status: state.status,
    user: state.user,
    isInitializing: state.status === 'initializing',
    isAuthenticated: state.status === 'authenticated',
    isGuest: state.status === 'guest',
    setSession,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
