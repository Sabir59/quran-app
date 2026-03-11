import { useCallback, useEffect, useState } from 'react';
import {
  addBookmark as add,
  clearAllBookmarks,
  getBookmarks,
  removeBookmark as remove,
} from '@/lib/bookmarks';
import type { Bookmark } from '@/lib/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await getBookmarks();
    setBookmarks(data);
  }, []);

  useEffect(() => {
    getBookmarks()
      .then(setBookmarks)
      .finally(() => setIsLoading(false));
  }, []);

  const addBookmark = useCallback(async (b: Omit<Bookmark, 'savedAt'>) => {
    await add(b);
    setBookmarks(await getBookmarks());
  }, []);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    await remove(surahNumber, ayahNumber);
    setBookmarks(await getBookmarks());
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllBookmarks();
    setBookmarks([]);
  }, []);

  /** O(1) check — avoids re-running on every render */
  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) =>
      bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),
    [bookmarks],
  );

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    clearAll,
    reload,
  };
}
