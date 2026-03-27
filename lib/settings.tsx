import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MushafStyle } from '@/api/quran/quran';

type ThemePref = 'light' | 'dark';

type SettingsState = {
  mushaf: MushafStyle;
  fontScale: number; // 1 = base, can be 0.8..1.6
  theme: ThemePref;
  setMushaf: (m: MushafStyle) => void;
  setFontScale: (n: number) => void;
  setTheme: (t: ThemePref) => void;
};

const DEFAULTS: Omit<SettingsState, 'setMushaf' | 'setFontScale' | 'setTheme'> = {
  mushaf: 'uthmani',
  fontScale: 1,
  theme: 'light',
};

const STORAGE_KEY = '@quranapp:settings';

type CtxType = SettingsState & { ready: boolean };
const Ctx = createContext<CtxType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState((s) => ({ ...s, ...parsed }));
        }
      } catch {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return; // don't overwrite storage with defaults before load
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const value = useMemo<CtxType>(
    () => ({
      ...state,
      ready,
      setMushaf: (m) => setState((s) => ({ ...s, mushaf: m })),
      setFontScale: (n) => setState((s) => ({ ...s, fontScale: n })),
      setTheme: (t) => setState((s) => ({ ...s, theme: t })),
    }),
    [state, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
