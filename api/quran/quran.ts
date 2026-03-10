import { quranClient } from '@/api/config/clients';

export const QURAN_ENDPOINTS = {
    SURAH_LIST: '/surah',
    SURAH_COMBINED: '/surah/:number/editions/:editions',
};

export type MushafStyle = 'uthmani' | 'indopak';

export type SurahSummary = {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
};

export type AyahCombined = {
    numberInSurah: number;
    arabic: string;
    transliteration?: string;
    translation?: string;
    audioUrl?: string;
};

export type SurahCombined = {
    surah: SurahSummary;
    ayahs: AyahCombined[];
};

export async function getSurahCombined(params: {
    surahNumber: number;
    mushaf: MushafStyle;
    translation?: string; // edition code like 'en.asad'
    reciter?: string; // audio edition like 'ar.alafasy'
}): Promise<SurahCombined> {
    const EDITION_BY_MUSHAF: Record<MushafStyle, string> = {
        uthmani: 'quran-uthmani',
        indopak: 'quran-indopak',
    };
    const DEFAULT_TRANSLATION = 'en.asad';
    const DEFAULT_RECITER = 'ar.alafasy';

    const TRANSLITERATION_EDITION = 'en.transliteration';
    const mushafEdition = EDITION_BY_MUSHAF[params.mushaf];
    const translation = params.translation ?? DEFAULT_TRANSLATION;
    const reciter = params.reciter ?? DEFAULT_RECITER;
    // Order: [0] mushaf, [1] transliteration, [2] translation, [3] audio
    const editions = [mushafEdition, TRANSLITERATION_EDITION, translation, reciter].join(',');
    const data = await quranClient.get<{ data: any[] }>(`/surah/${params.surahNumber}/editions/${editions}`);

    const mushafData = data.data[0];
    const transliterationData = data.data[1];
    const translationData = data.data[2];
    const audioData = data.data[3];

    const surahInfo: SurahSummary = {
        number: mushafData.number,
        name: mushafData.name,
        englishName: mushafData.englishName,
        englishNameTranslation: mushafData.englishNameTranslation,
        numberOfAyahs: mushafData.numberOfAyahs,
        revelationType: mushafData.revelationType,
    };

    const ayahs: AyahCombined[] = mushafData.ayahs.map((a: any, idx: number) => {
        const numberInSurah = a.numberInSurah as number;
        const arabic = a.text as string;
        const transliterationText = transliterationData?.ayahs?.[idx]?.text as string | undefined;
        const translationText = translationData?.ayahs?.[idx]?.text as string | undefined;
        const audioUrl = audioData?.ayahs?.[idx]?.audio as string | undefined;
        return { numberInSurah, arabic, transliteration: transliterationText, translation: translationText, audioUrl };
    });

    return { surah: surahInfo, ayahs };
}

export async function getSurahs(): Promise<SurahSummary[]> {
    const data = await quranClient.get<{ data: any[] }>(QURAN_ENDPOINTS.SURAH_LIST);
    return data.data.map((s) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
    }));
}

export function defaultTranslation() {
    return 'en.asad';
}

export function defaultReciter() {
    return 'ar.alafasy';
}

