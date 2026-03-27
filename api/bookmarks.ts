/**
 * api/bookmarks.ts — Firestore bookmark persistence layer
 *
 * Subcollection path: users/{uid}/bookmarks/{surahNumber}_{ayahNumber}
 *
 * Used by BookmarksContext when the user is authenticated.
 * Guests continue to use lib/bookmarks.ts (AsyncStorage).
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Bookmark } from '@/lib/bookmarks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bookmarkDocId(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}_${ayahNumber}`;
}

function bookmarksCol(uid: string) {
  return collection(db, 'users', uid, 'bookmarks');
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function getFirestoreBookmarks(uid: string): Promise<Bookmark[]> {
  const q = query(bookmarksCol(uid), orderBy('savedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Bookmark);
}

export async function addFirestoreBookmark(
  uid: string,
  b: Omit<Bookmark, 'savedAt'>,
): Promise<Bookmark> {
  const bookmark: Bookmark = { ...b, savedAt: new Date().toISOString() };
  const id = bookmarkDocId(b.surahNumber, b.ayahNumber);
  await setDoc(doc(bookmarksCol(uid), id), bookmark);
  return bookmark;
}

export async function removeFirestoreBookmark(
  uid: string,
  surahNumber: number,
  ayahNumber: number,
): Promise<void> {
  await deleteDoc(doc(bookmarksCol(uid), bookmarkDocId(surahNumber, ayahNumber)));
}

export async function clearAllFirestoreBookmarks(uid: string): Promise<void> {
  const snap = await getDocs(bookmarksCol(uid));
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}
