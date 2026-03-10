import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_FREQUENT_SURAHS } from '@/constants/home';

const KEY = '@quranapp:frequently_read';

/** Maps surahNumber → read count */
type FreqMap = Record<number, number>;

async function getMap(): Promise<FreqMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FreqMap;
  } catch {
    return {};
  }
}

/** Increment the read count for a surah. Call on every surah open. */
export async function incrementFrequentlyRead(surahNumber: number): Promise<void> {
  const map = await getMap();
  map[surahNumber] = (map[surahNumber] ?? 0) + 1;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

/**
 * Return the top `limit` surah numbers by read count.
 * Falls back to DEFAULT_FREQUENT_SURAHS if the user has no history yet.
 */
export async function getTopFrequentlyRead(limit = 5): Promise<number[]> {
  const map = await getMap();
  const entries = Object.entries(map) as [string, number][];
  if (entries.length === 0) return DEFAULT_FREQUENT_SURAHS.slice(0, limit);
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => Number(k));
}
