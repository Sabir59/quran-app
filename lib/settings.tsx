import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MushafStyle } from '@/api/quran/quran';

type ThemePref = 'system' | 'light' | 'dark';

type SettingsState = {
  mushaf: MushafStyle;
  reciter: string;
  translationEnabled: boolean;
  translationEdition: string;
  fontScale: number; // 1 = base, can be 0.8..1.6
  theme: ThemePref;
  setMushaf: (m: MushafStyle) => void;
  setReciter: (r: string) => void;
  setTranslationEnabled: (v: boolean) => void;
  setTranslationEdition: (e: string) => void;
  setFontScale: (n: number) => void;
  setTheme: (t: ThemePref) => void;
};

const DEFAULTS: Omit<SettingsState, 'setMushaf' | 'setReciter' | 'setTranslationEnabled' | 'setTranslationEdition' | 'setFontScale' | 'setTheme'> = {
  mushaf: 'uthmani',
  reciter: 'ar.alafasy',
  translationEnabled: true,
  translationEdition: 'en.asad',
  fontScale: 1,
  theme: 'system',
};

const STORAGE_KEY = '@quranapp:settings';

const Ctx = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState((s) => ({ ...s, ...parsed }));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const value = useMemo<SettingsState>(
    () => ({
      ...state,
      setMushaf: (m) => setState((s) => ({ ...s, mushaf: m })),
      setReciter: (r) => setState((s) => ({ ...s, reciter: r })),
      setTranslationEnabled: (v) => setState((s) => ({ ...s, translationEnabled: v })),
      setTranslationEdition: (e) => setState((s) => ({ ...s, translationEdition: e })),
      setFontScale: (n) => setState((s) => ({ ...s, fontScale: n })),
      setTheme: (t) => setState((s) => ({ ...s, theme: t })),
    }),
    [state],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
