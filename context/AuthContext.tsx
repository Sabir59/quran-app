/**
 * AuthContext.tsx — Global auth state machine
 *
 * Uses Firebase onAuthStateChanged as the single source of truth.
 * AsyncStorage is only used to persist guest mode.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { auth } from '@/lib/firebase';
import { buildSessionFromFirebaseUser } from '@/api/auth';
import { ensureUserDocFields } from '@/api/user';

import type { AuthSession, AuthStatus, AuthUser } from '@/types/auth';

const GUEST_KEY = '@quran_app/guest_mode';

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
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Signed-in user — clear any leftover guest flag
        await AsyncStorage.removeItem(GUEST_KEY);
        dispatch({ type: 'SET_SESSION', payload: buildSessionFromFirebaseUser(firebaseUser) });
        // Migrate existing accounts — adds missing Firestore fields, no-op if already complete
        ensureUserDocFields(
          firebaseUser.uid,
          firebaseUser.displayName ?? '',
          firebaseUser.email ?? '',
        ).catch(() => {});
      } else {
        // No Firebase user — check if guest mode is active
        const isGuest = await AsyncStorage.getItem(GUEST_KEY);
        if (isGuest === 'true') {
          dispatch({ type: 'SET_GUEST' });
        } else {
          dispatch({ type: 'SET_UNAUTHENTICATED' });
        }
      }
    });
    return unsubscribe;
  }, []);

  const loginAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
    dispatch({ type: 'SET_GUEST' });
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_KEY);
    await signOut(auth);
    dispatch({ type: 'SET_UNAUTHENTICATED' });
  }, []);

  const value: AuthContextValue = {
    status: state.status,
    user: state.user,
    isInitializing: state.status === 'initializing',
    isAuthenticated: state.status === 'authenticated',
    isGuest: state.status === 'guest',
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
