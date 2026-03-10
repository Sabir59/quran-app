import { useEffect, useMemo, useRef, useState } from 'react';
import type { SurahSummary } from '@/api/quran/quran';

const DEBOUNCE_MS = 300;

export function useHomeSearch(surahs: SurahSummary[] | undefined) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const results = useMemo<SurahSummary[] | null>(() => {
    if (!surahs || !debouncedQuery) return null;
    const q = debouncedQuery.toLowerCase();
    return surahs.filter(
      s =>
        String(s.number).startsWith(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(debouncedQuery), // Arabic match (case-sensitive by design)
    );
  }, [surahs, debouncedQuery]);

  return {
    query,
    setQuery,
    /** Non-null only when user has an active search query */
    results,
    isSearching: debouncedQuery.length > 0,
  };
}
