import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VisitRecord = {
  date: string;        // 'YYYY-MM-DD'
  surahNumber: number;
  surahName: string;
  lastAyah: number;
  timestamp: number;   // unix ms
};

type StoredData = {
  visits: VisitRecord[];
  totalListeningSeconds: number;
};

type ProgressContextValue = {
  visits: VisitRecord[];
  totalListeningSeconds: number;
  streak: number;
  lastRead: VisitRecord | null;
  weekActivity: boolean[];        // [0]=today, [1]=yesterday … [6]=6 days ago
  surahsVisited: number[];        // unique surah numbers visited
  recordVisit: (surahNumber: number, surahName: string, ayah?: number) => void;
  addListeningSeconds: (seconds: number) => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function today(): string {
  return toDateStr(new Date());
}

function daysAgo(n: number): string {
  return toDateStr(new Date(Date.now() - n * 86_400_000));
}

function computeStreak(visits: VisitRecord[]): number {
  if (visits.length === 0) return 0;
  const uniqueDates = [...new Set(visits.map(v => v.date))].sort().reverse();
  const t = today();
  const y = daysAgo(1);
  // Streak must include today or yesterday
  if (uniqueDates[0] !== t && uniqueDates[0] !== y) return 0;
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]).getTime();
    const curr = new Date(uniqueDates[i]).getTime();
    if ((prev - curr) / 86_400_000 === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeWeekActivity(visits: VisitRecord[]): boolean[] {
  // Index 0 = today, 6 = 6 days ago
  const dateCounts: Record<string, number> = {};
  for (const v of visits) {
    dateCounts[v.date] = (dateCounts[v.date] ?? 0) + 1;
  }
  return Array.from({ length: 7 }, (_, i) => !!dateCounts[daysAgo(i)]);
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = '@progress_v1';
const EMPTY: StoredData = { visits: [], totalListeningSeconds: 0 };

async function load(): Promise<StoredData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredData) : EMPTY;
  } catch {
    return EMPTY;
  }
}

async function save(data: StoredData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [totalListeningSeconds, setTotalListeningSeconds] = useState(0);

  // Use refs to hold current values for saves without closure issues
  const visitsRef = useRef<VisitRecord[]>([]);
  const listenSecsRef = useRef(0);

  // Load once on mount, initialize refs
  useEffect(() => {
    load().then(data => {
      visitsRef.current = data.visits;
      listenSecsRef.current = data.totalListeningSeconds;
      setVisits(data.visits);
      setTotalListeningSeconds(data.totalListeningSeconds);
    });
  }, []);

  const recordVisit = useCallback((surahNumber: number, surahName: string, ayah = 1) => {
    const record: VisitRecord = {
      date: today(),
      surahNumber,
      surahName,
      lastAyah: ayah,
      timestamp: Date.now(),
    };
    const trimmed = [...visitsRef.current, record].slice(-500);
    visitsRef.current = trimmed;
    setVisits(trimmed);
    save({ visits: trimmed, totalListeningSeconds: listenSecsRef.current });
  }, []);

  const addListeningSeconds = useCallback((seconds: number) => {
    if (seconds <= 0) return;
    listenSecsRef.current += seconds;
    setTotalListeningSeconds(listenSecsRef.current);
    save({ visits: visitsRef.current, totalListeningSeconds: listenSecsRef.current });
  }, []);

  // Derived — memoised so consumers don't re-render unnecessarily
  const streak = useMemo(() => computeStreak(visits), [visits]);
  const lastRead = useMemo(
    () => (visits.length > 0 ? visits[visits.length - 1] : null),
    [visits],
  );
  const weekActivity = useMemo(() => computeWeekActivity(visits), [visits]);
  const surahsVisited = useMemo(
    () => [...new Set(visits.map(v => v.surahNumber))],
    [visits],
  );

  return (
    <ProgressContext.Provider
      value={{
        visits,
        totalListeningSeconds,
        streak,
        lastRead,
        weekActivity,
        surahsVisited,
        recordVisit,
        addListeningSeconds,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
