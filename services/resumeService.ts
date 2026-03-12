import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@resume_v1';
const STALE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type ResumeMode = 'reading' | 'listening';

export type ResumeState = {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  positionMs: number;   // playback position within the ayah (0 if reading-only)
  durationMs: number;
  mode: ResumeMode;
  timestamp: number;
};

function validate(raw: unknown): ResumeState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (
    typeof r.surahNumber !== 'number' || r.surahNumber < 1 || r.surahNumber > 114 ||
    typeof r.ayahNumber !== 'number' || r.ayahNumber < 1 ||
    typeof r.positionMs !== 'number' || r.positionMs < 0 ||
    typeof r.timestamp !== 'number' ||
    (r.mode !== 'reading' && r.mode !== 'listening')
  ) return null;
  if (Date.now() - (r.timestamp as number) > STALE_MS) return null;
  return {
    surahNumber: r.surahNumber as number,
    surahName: typeof r.surahName === 'string' ? r.surahName : '',
    ayahNumber: r.ayahNumber as number,
    positionMs: r.positionMs as number,
    durationMs: typeof r.durationMs === 'number' ? r.durationMs : 0,
    mode: r.mode as ResumeMode,
    timestamp: r.timestamp as number,
  };
}

let pendingSave: ReturnType<typeof setTimeout> | null = null;
let pendingState: ResumeState | null = null;

async function flush() {
  if (!pendingState) return;
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pendingState)); } catch {}
  pendingState = null;
}

export const resumeService = {
  save(state: ResumeState, debounceMs = 800): void {
    pendingState = state;
    if (pendingSave) clearTimeout(pendingSave);
    pendingSave = setTimeout(flush, debounceMs);
  },
  saveImmediate(state: ResumeState): void {
    if (pendingSave) { clearTimeout(pendingSave); pendingSave = null; }
    pendingState = state; // keep in memory so loadLatest() wins the race vs AsyncStorage write
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  },
  /** Returns the latest in-memory state (not yet flushed to AsyncStorage), or null. */
  getCurrent(): ResumeState | null {
    return pendingState;
  },
  /** Returns in-memory pending state if available, otherwise reads from AsyncStorage. */
  async loadLatest(): Promise<ResumeState | null> {
    if (pendingState) return pendingState;
    return this.load();
  },
  async load(): Promise<ResumeState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return validate(JSON.parse(raw));
    } catch { return null; }
  },
  async clear(): Promise<void> {
    if (pendingSave) { clearTimeout(pendingSave); pendingSave = null; }
    pendingState = null;
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
  },
};
