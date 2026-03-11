/**
 * context/BookmarksContext.tsx — Global bookmarks state
 *
 * Loads from AsyncStorage ONCE on app start. All screens share the same
 * in-memory state — no per-screen re-reads, no flicker on navigation.
 *
 * SWAP GUIDE (when NestJS backend is ready):
 *   - Replace lib/bookmarks.ts functions with API calls.
 *   - This context stays exactly the same.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  addBookmark as add,
  clearAllBookmarks,
  getBookmarks,
  removeBookmark as remove,
} from '@/lib/bookmarks';
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load once on mount
  useEffect(() => {
    getBookmarks()
      .then(setBookmarks)
      .finally(() => setIsLoading(false));
  }, []);

  const reload = useCallback(async () => {
    const data = await getBookmarks();
    setBookmarks(data);
  }, []);

  const addBookmark = useCallback(async (b: Omit<Bookmark, 'savedAt'>) => {
    await add(b);
    // Optimistic update — prepend immediately, no re-read needed
    setBookmarks(prev => {
      const exists = prev.some(
        x => x.surahNumber === b.surahNumber && x.ayahNumber === b.ayahNumber,
      );
      if (exists) return prev;
      const withTimestamp: Bookmark = { ...b, savedAt: new Date().toISOString() };
      return [withTimestamp, ...prev];
    });
  }, []);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    await remove(surahNumber, ayahNumber);
    setBookmarks(prev =>
      prev.filter(x => !(x.surahNumber === surahNumber && x.ayahNumber === ayahNumber)),
    );
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllBookmarks();
    setBookmarks([]);
  }, []);

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
  if (!ctx) throw new Error('useBookmarks must be used inside <BookmarksProvider>');
  return ctx;
}
