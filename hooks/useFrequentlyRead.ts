import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SurahSummary } from '@/api/quran/quran';
import { DEFAULT_FREQUENT_SURAHS } from '@/constants/home';
import { getTopFrequentlyRead, incrementFrequentlyRead } from '@/lib/frequently-read';

export function useFrequentlyRead(allSurahs: SurahSummary[]) {
  const [topNumbers, setTopNumbers] = useState<number[]>(DEFAULT_FREQUENT_SURAHS.slice(0, 5));

  // Load persisted data on mount
  useEffect(() => {
    getTopFrequentlyRead(5).then(setTopNumbers).catch(() => {});
  }, []);

  // Resolve surah objects from number list (order preserved)
  const frequentSurahs = useMemo(
    () =>
      topNumbers
        .map(n => allSurahs.find(s => s.number === n))
        .filter((s): s is SurahSummary => s !== undefined),
    [topNumbers, allSurahs],
  );

  /** Call this when the user opens a surah — persists + refreshes the list */
  const trackRead = useCallback(async (surahNumber: number) => {
    try {
      await incrementFrequentlyRead(surahNumber);
      const updated = await getTopFrequentlyRead(5);
      setTopNumbers(updated);
    } catch {
      // Non-critical — silent fail
    }
  }, []);

  return { frequentSurahs, trackRead };
}
