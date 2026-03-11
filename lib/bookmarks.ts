/**
 * lib/bookmarks.ts — Bookmark persistence layer
 *
 * Storage: AsyncStorage (local, no account required).
 *
 * SWAP GUIDE (when NestJS backend is ready):
 *   - Replace getBookmarks()   → GET  /bookmarks
 *   - Replace addBookmark()    → POST /bookmarks
 *   - Replace removeBookmark() → DELETE /bookmarks/:surahNumber/:ayahNumber
 *   - Replace clearAll()       → DELETE /bookmarks
 *   Only this file changes — hooks and components stay the same.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  transliteration?: string;
  translation?: string;
  /** ISO timestamp — used for "Recently saved" sort order */
  savedAt: string;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const KEY = '@quranapp:bookmarks_v2';

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

export async function addBookmark(b: Omit<Bookmark, 'savedAt'>): Promise<void> {
  const all = await getBookmarks();
  const exists = all.some(
    x => x.surahNumber === b.surahNumber && x.ayahNumber === b.ayahNumber,
  );
  if (!exists) {
    const withTimestamp: Bookmark = { ...b, savedAt: new Date().toISOString() };
    all.unshift(withTimestamp);
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  }
}

export async function removeBookmark(
  surahNumber: number,
  ayahNumber: number,
): Promise<void> {
  const all = await getBookmarks();
  const next = all.filter(
    x => !(x.surahNumber === surahNumber && x.ayahNumber === ayahNumber),
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function isBookmarkSaved(
  surahNumber: number,
  ayahNumber: number,
): Promise<boolean> {
  const all = await getBookmarks();
  return all.some(x => x.surahNumber === surahNumber && x.ayahNumber === ayahNumber);
}

export async function clearAllBookmarks(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
