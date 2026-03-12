import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HOME_COLORS } from '@/constants/home';
import { useProgress } from '@/context/ProgressContext';

const TEAL = HOME_COLORS.teal;
const TOTAL_SURAHS = 114;

// ─── Week Activity Strip ──────────────────────────────────────────────────────

const DAY_LABELS = ['T', 'W', 'T', 'F', 'S', 'S', 'M']; // today is index 0 reversed

function WeekActivityStrip({ activity }: { activity: boolean[] }) {
  // activity[0]=today … activity[6]=6 days ago; display left=oldest, right=today
  const reversed = [...activity].reverse();
  const labels = [...DAY_LABELS].reverse();

  return (
    <View style={strip.row}>
      {reversed.map((active, i) => (
        <View key={i} style={strip.cell}>
          <View
            style={[
              strip.dot,
              { backgroundColor: active ? TEAL : 'transparent', borderColor: active ? TEAL : '#9CA3AF' },
            ]}
          />
          <Text style={strip.label}>{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const strip = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  cell: { alignItems: 'center', gap: 6 },
  dot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5 },
  label: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
});

// ─── Surah Grid ───────────────────────────────────────────────────────────────

function SurahGrid({ visited }: { visited: number[] }) {
  const visitedSet = new Set(visited);
  const cells = Array.from({ length: TOTAL_SURAHS }, (_, i) => i + 1);

  return (
    <View style={grid.wrap}>
      {cells.map(n => (
        <View
          key={n}
          style={[
            grid.cell,
            visitedSet.has(n)
              ? { backgroundColor: TEAL }
              : { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#374151' },
          ]}
        >
          <Text
            style={[grid.num, { color: visitedSet.has(n) ? 'white' : '#6B7280' }]}
          >
            {n}
          </Text>
        </View>
      ))}
    </View>
  );
}

const grid = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 2 },
  cell: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 10, fontWeight: '700' },
});

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <View className="flex-1 bg-card rounded-2xl items-center py-4 gap-1">
      <Text style={{ fontSize: 22, fontWeight: '800', color: TEAL }}>{value}</Text>
      <Text className="text-xs text-muted-foreground font-semibold">{label}</Text>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatListening(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const headerBg = isDark ? '#0a0a0f' : TEAL;

  const {
    streak,
    lastRead,
    weekActivity,
    surahsVisited,
    totalListeningSeconds,
  } = useProgress();

  const readCount = surahsVisited.length;
  const completionPct = Math.round((readCount / TOTAL_SURAHS) * 100);

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.root, { backgroundColor: headerBg }]}>
        {/* ── Header ───────────────────────────────────────────────── */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSub}>Your Journey</Text>
              <Text style={styles.headerTitle}>
                {streak > 0 ? `${streak} Day Streak 🔥` : 'Start Your Streak'}
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakNum}>{streak}</Text>
              <Text style={styles.streakFire}>🔥</Text>
            </View>
          </View>
        </SafeAreaView>

        {/* ── Content sheet ────────────────────────────────────────── */}
        <View className="flex-1 bg-background rounded-t-[28px]" style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            {/* Continue Reading */}
            {lastRead ? (
              <Pressable
                onPress={() =>
                  router.push(
                    `/(main)/surah?number=${lastRead.surahNumber}&name=${encodeURIComponent(lastRead.surahName)}`,
                  )
                }
                style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              >
                <View className="bg-card rounded-2xl p-4 flex-row items-center gap-3">
                  <View style={[styles.continueIcon, { backgroundColor: TEAL + '20' }]}>
                    <Ionicons name="book-outline" size={22} color={TEAL} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="text-xs text-muted-foreground font-semibold mb-0.5">
                      Continue Reading
                    </Text>
                    <Text className="text-base font-bold text-foreground">
                      {lastRead.surahName}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      Ayah {lastRead.lastAyah}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={() => router.push('/(main)/home')}>
                <View className="bg-card rounded-2xl p-4 flex-row items-center gap-3">
                  <View style={[styles.continueIcon, { backgroundColor: TEAL + '20' }]}>
                    <Ionicons name="book-outline" size={22} color={TEAL} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="text-xs text-muted-foreground font-semibold mb-0.5">
                      Get Started
                    </Text>
                    <Text className="text-base font-bold text-foreground">
                      Open a Surah to begin
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </Pressable>
            )}

            {/* Week Activity */}
            <View className="bg-card rounded-2xl p-4 gap-3">
              <Text className="text-sm font-bold text-foreground">This Week</Text>
              <WeekActivityStrip activity={weekActivity} />
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard value={`${readCount}`} label="Surahs" icon="book" />
              <StatCard value={`${streak}`} label="Day Streak" icon="flame" />
              <StatCard
                value={formatListening(totalListeningSeconds)}
                label="Listened"
                icon="headset"
              />
            </View>

            {/* Surah Completion */}
            <View className="bg-card rounded-2xl p-4 gap-4">
              <View style={styles.completionHeader}>
                <Text className="text-sm font-bold text-foreground">Surahs Read</Text>
                <Text style={{ color: TEAL, fontWeight: '700', fontSize: 13 }}>
                  {readCount} / {TOTAL_SURAHS}
                </Text>
              </View>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${completionPct}%` as any },
                  ]}
                />
              </View>
              <SurahGrid visited={surahsVisited} />
            </View>

          </ScrollView>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} className="bg-background" />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeTop: { backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '800' },
  streakBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNum: { color: 'white', fontSize: 16, fontWeight: '800', lineHeight: 18 },
  streakFire: { fontSize: 12, lineHeight: 14 },
  sheet: { overflow: 'hidden' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },
  continueIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10 },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTrack: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 3,
  },
});
