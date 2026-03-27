/**
 * context/BookmarksContext.tsx — Global bookmarks state
 *
 * Storage strategy:
 *   authenticated → Firestore  (users/{uid}/bookmarks subcollection)
 *   guest / unauthenticated  → AsyncStorage (local, no account required)
 *
 * The context interface is identical regardless of storage backend —
 * screens and hooks never need to know which one is active.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  addBookmark as addLocal,
  clearAllBookmarks as clearLocal,
  getBookmarks as getLocal,
  removeBookmark as removeLocal,
} from '@/lib/bookmarks';
import {
  addFirestoreBookmark,
  clearAllFirestoreBookmarks,
  getFirestoreBookmarks,
  removeFirestoreBookmark,
} from '@/api/bookmarks';
import type { Bookmark } from '@/lib/bookmarks';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookmarksContextValue {
  bookmarks: Bookmark[];
  isLoading: boolean;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  addBookmark: (b: Omit<Bookmark, 'savedAt'>) => Promise<void>;
  removeBookmark: (surahNumber: number, ayahNumber: number) => Promise<void>;
  clearAll: () => Promise<void>;
  reload: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthed = status === 'authenticated' && !!user?.id;

  // ── Load bookmarks whenever auth state settles or switches ─────────────────
  useEffect(() => {
    if (status === 'initializing') return;

    setIsLoading(true);
    const load = isAuthed
      ? getFirestoreBookmarks(user!.id)
      : getLocal();

    load
      .then(setBookmarks)
      .catch(() => setBookmarks([]))
      .finally(() => setIsLoading(false));
  }, [status, user?.id]);

  // ── Reload helper ──────────────────────────────────────────────────────────
  const reload = useCallback(async () => {
    const data = isAuthed ? await getFirestoreBookmarks(user!.id) : await getLocal();
    setBookmarks(data);
  }, [isAuthed, user?.id]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addBookmark = useCallback(async (b: Omit<Bookmark, 'savedAt'>) => {
    let withTimestamp: Bookmark;
    if (isAuthed) {
      withTimestamp = await addFirestoreBookmark(user!.id, b);
    } else {
      await addLocal(b);
      withTimestamp = { ...b, savedAt: new Date().toISOString() };
    }
    // Optimistic prepend — no re-read needed
    setBookmarks(prev => {
      const exists = prev.some(
        x => x.surahNumber === b.surahNumber && x.ayahNumber === b.ayahNumber,
      );
      return exists ? prev : [withTimestamp, ...prev];
    });
  }, [isAuthed, user?.id]);

  // ── Remove ────────────────────────────────────────────────────────────────
  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    if (isAuthed) {
      await removeFirestoreBookmark(user!.id, surahNumber, ayahNumber);
    } else {
      await removeLocal(surahNumber, ayahNumber);
    }
    setBookmarks(prev =>
      prev.filter(x => !(x.surahNumber === surahNumber && x.ayahNumber === ayahNumber)),
    );
  }, [isAuthed, user?.id]);

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearAll = useCallback(async () => {
    if (isAuthed) {
      await clearAllFirestoreBookmarks(user!.id);
    } else {
      await clearLocal();
    }
    setBookmarks([]);
  }, [isAuthed, user?.id]);

  // ── isBookmarked ──────────────────────────────────────────────────────────
  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) =>
      bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),
    [bookmarks],
  );

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, isLoading, isBookmarked, addBookmark, removeBookmark, clearAll, reload }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be inside <BookmarksProvider>');
  return ctx;
}
