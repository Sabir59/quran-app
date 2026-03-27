/**
 * api/user.ts — Firestore user profile CRUD + Firebase Storage photo upload
 *
 * All operations target: users/{uid}
 */

import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { DEFAULT_TRANSLATION_ID } from '@/constants/translations';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfileData {
  name: string;
  email: string;
  photoURL: string;
  reciter: string;
  translationEdition: string;
  streak: number;
  surahsRead: number;
  totalListeningSeconds: number;
}

export const DEFAULT_PROFILE: Omit<UserProfileData, 'name' | 'email'> = {
  photoURL: '',
  reciter: 'ar.alafasy',
  translationEdition: DEFAULT_TRANSLATION_ID,
  streak: 0,
  surahsRead: 0,
  totalListeningSeconds: 0,
};

// ─── Load ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    name: d.name ?? '',
    email: d.email ?? '',
    photoURL: d.photoURL ?? '',
    reciter: d.reciter ?? DEFAULT_PROFILE.reciter,
    translationEdition: d.translationEdition ?? DEFAULT_PROFILE.translationEdition,
    streak: d.streak ?? 0,
    surahsRead: d.surahsRead ?? 0,
    totalListeningSeconds: d.totalListeningSeconds ?? 0,
  };
}

// ─── Update name ──────────────────────────────────────────────────────────────

export async function updateUserName(uid: string, name: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), { name }, { merge: true });
  if (auth.currentUser) {
    await updateFirebaseProfile(auth.currentUser, { displayName: name });
  }
}

// ─── Update settings (reciter / translationEdition) ──────────────────────────

export async function updateUserSettings(
  uid: string,
  settings: Partial<Pick<UserProfileData, 'reciter' | 'translationEdition'>>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), settings, { merge: true });
}

// ─── Sync progress stats ──────────────────────────────────────────────────────

export async function syncUserProgress(
  uid: string,
  stats: Pick<UserProfileData, 'streak' | 'surahsRead' | 'totalListeningSeconds'>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), stats, { merge: true });
}

// ─── Upload profile photo ─────────────────────────────────────────────────────

export async function uploadProfilePhoto(uid: string, localUri: string): Promise<string> {
  // Fetch the local file and convert to blob
  const response = await fetch(localUri);
  const blob = await response.blob();

  // Upload to Firebase Storage
  const storageRef = ref(storage, `profile-images/${uid}`);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);

  // Persist URL to Firestore + Firebase Auth
  await setDoc(doc(db, 'users', uid), { photoURL: downloadURL }, { merge: true });
  if (auth.currentUser) {
    await updateFirebaseProfile(auth.currentUser, { photoURL: downloadURL });
  }

  return downloadURL;
}

// ─── Ensure user doc has all new fields (migration for existing accounts) ─────

export async function ensureUserDocFields(uid: string, name: string, email: string): Promise<void> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      bookmarks: [],
      ...DEFAULT_PROFILE,
    });
  } else {
    const data = snap.data();
    const missing: Record<string, unknown> = {};
    if (data.reciter === undefined) missing.reciter = DEFAULT_PROFILE.reciter;
    if (data.translationEdition === undefined) missing.translationEdition = DEFAULT_PROFILE.translationEdition;
    if (data.photoURL === undefined) missing.photoURL = '';
    if (data.streak === undefined) missing.streak = 0;
    if (data.surahsRead === undefined) missing.surahsRead = 0;
    if (data.totalListeningSeconds === undefined) missing.totalListeningSeconds = 0;
    if (Object.keys(missing).length > 0) {
      await setDoc(doc(db, 'users', uid), missing, { merge: true });
    }
  }
}
