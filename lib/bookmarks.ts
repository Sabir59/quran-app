import AsyncStorage from '@react-native-async-storage/async-storage';

export type Bookmark = {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation?: string;
};

const KEY = '@quranapp:bookmarks';

export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

export async function addBookmark(b: Bookmark): Promise<void> {
  const all = await getBookmarks();
  const exists = all.some((x) => x.surahNumber === b.surahNumber && x.ayahNumber === b.ayahNumber);
  if (!exists) {
    all.unshift(b);
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  }
}

export async function removeBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
  const all = await getBookmarks();
  const next = all.filter((x) => !(x.surahNumber === surahNumber && x.ayahNumber === ayahNumber));
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

