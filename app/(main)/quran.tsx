import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import {
  Image,
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
import { useUserProfile } from '@/context/UserProfileContext';
import { useAuth } from '@/context/AuthContext';
import { resumeService } from '@/services/resumeService';
import type { ResumeState } from '@/services/resumeService';
import { scrollTarget } from '@/services/scrollTarget';

const TEAL = HOME_COLORS.teal;
const TOTAL_SURAHS = 114;

// ─── Week Activity Strip ──────────────────────────────────────────────────────

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sun=0 … Sat=6

function WeekActivityStrip({ activity }: { activity: boolean[] }) {
  // activity[0]=today … activity[6]=6 days ago; reverse so display is left=oldest, right=today
  const reversed = [...activity].reverse();
  return (
    <View style={strip.row}>
      {reversed.map((active, i) => {
        const daysBack = 6 - i; // i=0 → 6 days ago, i=6 → today
        const date = new Date(Date.now() - daysBack * 86_400_000);
        const label = DAY_INITIALS[date.getDay()];
        return (
          <View key={i} style={strip.cell}>
            <View style={[strip.dot, { backgroundColor: active ? TEAL : 'transparent', borderColor: active ? TEAL : '#9CA3AF' }]} />
            <Text style={strip.label}>{label}</Text>
          </View>
        );
      })}
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
          <Text style={[grid.num, { color: visitedSet.has(n) ? 'white' : '#6B7280' }]}>{n}</Text>
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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 bg-card rounded-2xl items-center py-4 gap-1">
      <Text style={{ fontSize: 22, fontWeight: '800', color: TEAL }}>{value}</Text>
      <Text className="text-xs text-muted-foreground font-semibold">{label}</Text>
    </View>
  );
}

// ─── Continue Reading Card ────────────────────────────────────────────────────

function ContinueCard({ resume }: { resume: ResumeState | null }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    if (!resume) {
      router.push('/(main)/home');
      return;
    }
    // Store the resume target in module-level state so surah.tsx can read it
    // reliably on focus — URL params are unreliable for Tabs.Screen navigation
    // because tab navigate() semantics drop param updates for the same route.
    scrollTarget.set({
      surahNumber: resume.surahNumber,
      ayahNumber: resume.ayahNumber,
      positionMs: resume.positionMs,
      openPlayer: true,
    });
    router.push(`/(main)/surah?number=${resume.surahNumber}&name=${encodeURIComponent(resume.surahName)}` as any);
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
      <View className="bg-card rounded-2xl p-4 flex-row items-center gap-3">
        <View style={[styles.continueIcon, { backgroundColor: TEAL + '20' }]}>
          <Ionicons name={resume?.mode === 'listening' ? 'headset-outline' : 'book-outline'} size={22} color={TEAL} />
        </View>
        <View style={{ flex: 1 }}>
          {resume ? (
            <>
              <Text className="text-xs text-muted-foreground font-semibold mb-0.5">
                {resume.mode === 'listening' ? 'Continue Listening' : 'Continue Reading'}
              </Text>
              <Text className="text-base font-bold text-foreground">{resume.surahName}</Text>
              <Text className="text-xs text-muted-foreground">
                Ayah {resume.ayahNumber}
                {resume.mode === 'listening' && resume.positionMs > 0
                  ? ` · ${Math.floor(resume.positionMs / 1000)}s in`
                  : ''}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-xs text-muted-foreground font-semibold mb-0.5">Get Started</Text>
              <Text className="text-base font-bold text-foreground">Open a Surah to begin</Text>
            </>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
      </View>
    </Pressable>
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

  const { streak, lastRead, weekActivity, surahsVisited, totalListeningSeconds, visits } = useProgress();
  const { isGuest } = useAuth();
  const { name, photoURL, cloudStats } = useUserProfile();
  const avatarInitials = isGuest
    ? '?'
    : (name || 'U').split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('');
  const [resumeState, setResumeState] = useState<ResumeState | null>(null);

  // Reload resume state every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      resumeService.loadLatest().then(r => {
        if (r) {
          setResumeState(r);
        } else if (lastRead) {
          setResumeState({
            surahNumber: lastRead.surahNumber,
            surahName: lastRead.surahName,
            ayahNumber: lastRead.lastAyah,
            positionMs: 0,
            durationMs: 0,
            mode: 'reading',
            timestamp: lastRead.timestamp,
          });
        }
      });
    }, [lastRead]),
  );

  // When local AsyncStorage is empty (new device), fall back to Firestore cloud stats
  const hasLocalData = visits.length > 0;
  const displayStreak = hasLocalData ? streak : (cloudStats?.streak ?? 0);
  const displaySurahsRead = hasLocalData ? surahsVisited.length : (cloudStats?.surahsRead ?? 0);
  const displayListening = hasLocalData ? totalListeningSeconds : (cloudStats?.totalListeningSeconds ?? 0);

  const readCount = displaySurahsRead;
  const completionPct = Math.round((readCount / TOTAL_SURAHS) * 100);

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[screenStyles.root, { backgroundColor: headerBg }]}>

        {/* Header */}
        <SafeAreaView edges={['top', 'left', 'right']} style={screenStyles.safeTop}>
          <View style={screenStyles.header}>
            <View>
              <Text style={screenStyles.headerSub}>Your Journey</Text>
              <Text style={screenStyles.headerTitle}>
                {displayStreak > 0 ? `${displayStreak} Day Streak 🔥` : 'Start Your Streak'}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/(main)/profile')}
              style={screenStyles.avatar}
              hitSlop={8}
            >
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={screenStyles.avatarImage} />
              ) : (
                <Text style={screenStyles.avatarText}>{avatarInitials}</Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Content sheet */}
        <View className="flex-1 bg-background rounded-t-[28px]" style={screenStyles.sheet}>
          <ScrollView contentContainerStyle={screenStyles.scrollContent} showsVerticalScrollIndicator={false}>

            <ContinueCard resume={resumeState} />

            {/* Week Activity */}
            <View className="bg-card rounded-2xl p-4 gap-3">
              <Text className="text-sm font-bold text-foreground">This Week</Text>
              <WeekActivityStrip activity={weekActivity} />
            </View>

            {/* Stats */}
            <View style={screenStyles.statsRow}>
              <StatCard value={`${displaySurahsRead}`} label="Surahs" />
              <StatCard value={`${displayStreak}`} label="Day Streak" />
              <StatCard value={formatListening(displayListening)} label="Listened" />
            </View>

            {/* Surah completion */}
            <View className="bg-card rounded-2xl p-4 gap-4">
              <View style={screenStyles.completionHeader}>
                <Text className="text-sm font-bold text-foreground">Surahs Read</Text>
                <Text style={{ color: TEAL, fontWeight: '700', fontSize: 13 }}>{readCount} / {TOTAL_SURAHS}</Text>
              </View>
              <View style={screenStyles.progressTrack}>
                <View style={[screenStyles.progressFill, { width: `${completionPct}%` as any }]} />
              </View>
              <SurahGrid visited={surahsVisited} />
            </View>

          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  continueIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

const screenStyles = StyleSheet.create({
  root: { flex: 1 },
  safeTop: { backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20,
  },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '800' },
  streakBadge: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  streakNum: { color: 'white', fontSize: 16, fontWeight: '800', lineHeight: 18 },
  streakFire: { fontSize: 12, lineHeight: 14 },
  sheet: { overflow: 'hidden' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImage: { width: 44, height: 44, borderRadius: 22 },
  avatarText: { color: 'white', fontSize: 14, fontWeight: '700' },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 10 },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTrack: { height: 6, backgroundColor: '#374151', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: TEAL, borderRadius: 3 },
});
