import { defaultReciter, defaultTranslation, getSurahCombined, getSurahs, MushafStyle } from '@/api/quran/quran';
import { useQuery } from '@tanstack/react-query';

export function useSurahList() {
  return useQuery({
    queryKey: ['quran', 'surahs'],
    queryFn: () => getSurahs(),
  });
}

export function useSurahDetail(params: {
  surahNumber: number;
  mushaf: MushafStyle;
  translationEnabled: boolean;
  translationEdition?: string;
  reciter?: string;
}) {
  const translation = params.translationEnabled ? (params.translationEdition ?? defaultTranslation()) : undefined;
  const reciter = params.reciter ?? defaultReciter();
  return useQuery({
    queryKey: ['quran', 'surah', params.surahNumber, params.mushaf, translation ?? 'none', reciter],
    queryFn: () =>
      getSurahCombined({
        surahNumber: params.surahNumber,
        mushaf: params.mushaf,
        translation,
        reciter,
      }),
  });
}
