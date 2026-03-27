/**
 * context/UserProfileContext.tsx — User profile + preferences state
 *
 * Storage strategy:
 *   authenticated → Firestore  (users/{uid})
 *   guest / unauthenticated  → AsyncStorage (local defaults)
 *
 * Manages: name, photoURL, reciter, translationEdition
 * Stats sync: provides syncProgress() called by ProgressContext
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  DEFAULT_PROFILE,
  getUserProfile,
  syncUserProgress,
  updateUserName,
  updateUserSettings,
  uploadProfilePhoto,
  type UserProfileData,
} from '@/api/user';

// ─── AsyncStorage key (guests / local fallback) ────────────────────────────────

const LOCAL_PREFS_KEY = '@quranapp:user_prefs';

async function loadLocalPrefs(): Promise<Partial<UserProfileData>> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveLocalPrefs(prefs: Partial<UserProfileData>): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CloudStats {
  streak: number;
  surahsRead: number;
  totalListeningSeconds: number;
}

interface UserProfileContextValue {
  name: string;
  photoURL: string;
  reciter: string;
  translationEdition: string;   // 'off' = translation disabled
  isLoading: boolean;
  /** Stats last read from Firestore — used as fallback when local AsyncStorage is empty (e.g. new device) */
  cloudStats: CloudStats | null;
  updateName: (name: string) => Promise<void>;
  updatePhoto: (localUri: string) => Promise<void>;
  setReciter: (id: string) => Promise<void>;
  setTranslationEdition: (edition: string) => Promise<void>;
  syncProgress: (stats: {
    streak: number;
    surahsRead: number;
    totalListeningSeconds: number;
  }) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [reciter, setReciterState] = useState(DEFAULT_PROFILE.reciter);
  const [translationEdition, setTranslationEditionState] = useState(DEFAULT_PROFILE.translationEdition);
  const [isLoading, setIsLoading] = useState(true);
  const [cloudStats, setCloudStats] = useState<CloudStats | null>(null);

  const isAuthed = status === 'authenticated' && !!user?.id;

  // ── Load on auth state change ─────────────────────────────────────────────
  useEffect(() => {
    if (status === 'initializing') return;
    setIsLoading(true);

    if (isAuthed) {
      getUserProfile(user!.id)
        .then(profile => {
          if (profile) {
            setName(profile.name);
            setPhotoURL(profile.photoURL);
            setReciterState(profile.reciter);
            setTranslationEditionState(profile.translationEdition);
            setCloudStats({
              streak: profile.streak,
              surahsRead: profile.surahsRead,
              totalListeningSeconds: profile.totalListeningSeconds,
            });
          } else {
            // Doc exists from old signup without new fields — use defaults + auth name
            setName(user!.name ?? '');
            setPhotoURL('');
            setReciterState(DEFAULT_PROFILE.reciter);
            setTranslationEditionState(DEFAULT_PROFILE.translationEdition);
            setCloudStats(null);
          }
        })
        .catch(() => {
          setName(user!.name ?? '');
          setCloudStats(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      // Guest / unauthenticated — load local prefs
      loadLocalPrefs().then(prefs => {
        setName('');
        setPhotoURL('');
        setReciterState(prefs.reciter ?? DEFAULT_PROFILE.reciter);
        setTranslationEditionState(prefs.translationEdition ?? DEFAULT_PROFILE.translationEdition);
        setCloudStats(null);
        setIsLoading(false);
      });
    }
  }, [status, user?.id]);

  // ── Update name ───────────────────────────────────────────────────────────
  const updateName = useCallback(async (newName: string) => {
    setName(newName);
    if (isAuthed) {
      await updateUserName(user!.id, newName);
    }
  }, [isAuthed, user?.id]);

  // ── Update photo ──────────────────────────────────────────────────────────
  const updatePhoto = useCallback(async (localUri: string) => {
    if (!isAuthed) return;
    const url = await uploadProfilePhoto(user!.id, localUri);
    setPhotoURL(url);
  }, [isAuthed, user?.id]);

  // ── Set reciter ───────────────────────────────────────────────────────────
  const setReciter = useCallback(async (id: string) => {
    setReciterState(id);
    if (isAuthed) {
      await updateUserSettings(user!.id, { reciter: id });
    } else {
      const prefs = await loadLocalPrefs();
      await saveLocalPrefs({ ...prefs, reciter: id });
    }
  }, [isAuthed, user?.id]);

  // ── Set translation edition ───────────────────────────────────────────────
  const setTranslationEdition = useCallback(async (edition: string) => {
    setTranslationEditionState(edition);
    if (isAuthed) {
      await updateUserSettings(user!.id, { translationEdition: edition });
    } else {
      const prefs = await loadLocalPrefs();
      await saveLocalPrefs({ ...prefs, translationEdition: edition });
    }
  }, [isAuthed, user?.id]);

  // ── Sync progress to Firestore (fire-and-forget) ──────────────────────────
  const syncProgress = useCallback((stats: {
    streak: number;
    surahsRead: number;
    totalListeningSeconds: number;
  }) => {
    if (!isAuthed) return;
    syncUserProgress(user!.id, stats).catch(() => {});
  }, [isAuthed, user?.id]);

  return (
    <UserProfileContext.Provider
      value={{
        name,
        photoURL,
        reciter,
        translationEdition,
        isLoading,
        cloudStats,
        updateName,
        updatePhoto,
        setReciter,
        setTranslationEdition,
        syncProgress,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be inside <UserProfileProvider>');
  return ctx;
}
