import { useEffect, useState, useCallback } from 'react';
import { addBookmark as add, getBookmarks as load, removeBookmark as remove, Bookmark } from '@/lib/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    load().then(setBookmarks);
  }, []);

  const addBookmark = useCallback(async (b: Bookmark) => {
    await add(b);
    setBookmarks(await load());
  }, []);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    await remove(surahNumber, ayahNumber);
    setBookmarks(await load());
  }, []);

  return { bookmarks, addBookmark, removeBookmark, reload: async () => setBookmarks(await load()) };
}

