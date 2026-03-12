import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import type { AyahCombined } from '@/api/quran/quran';
import { AyahCard } from '@/components/surah/AyahCard';
import { PickerModal } from '@/components/surah/PickerModal';
import { SurahHeroCard } from '@/components/surah/SurahHeroCard';
import { HOME_COLORS } from '@/constants/home';
import { useSurahDetail, useSurahList } from '@/hooks/api/quran';
import { useBookmarks } from '@/context/BookmarksContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import type { PlayerTrack } from '@/context/AudioPlayerContext';
import { useProgress } from '@/context/ProgressContext';
import { resumeService } from '@/services/resumeService';
import type { ResumeState } from '@/services/resumeService';

const bgAuth = require('@/assets/images/bg-auth.png');
const logoAlQuran = require('@/assets/images/logo-al-quran.png');

export default function SurahScreen() {
  const {
    number,
    name,
    ayah: ayahParam,
    positionMs: positionMsParam,
  } = useLocalSearchParams<{ number: string; name: string; ayah?: string; positionMs?: string }>();

  const surahNumber = Number(number);
  const resumeAyah = Number(ayahParam) || 0;
  const resumePositionMs = Number(positionMsParam) || 0;

  const { data, isLoading, isError, refetch } = useSurahDetail({
    surahNumber,
    mushaf: 'uthmani',
    translationEnabled: true,
  });
  const { data: surahList } = useSurahList();
  const { isBookmarked: checkBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const {
    loadAndPlay, playPause, currentTrack, isPlaying, position, duration,
  } = useAudioPlayer();
  const { recordVisit } = useProgress();

  const [currentAyah, setCurrentAyah] = useState(resumeAyah || 1);
  const [surahPickerVisible, setSurahPickerVisible] = useState(false);
  const [ayahPickerVisible, setAyahPickerVisible] = useState(false);

  const flatListRef = useRef<FlatList<AyahCombined>>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });
  const hasScrolledToResume = useRef(false);
  const hasRestoredAudio = useRef(false);

  // ── Always-current state snapshot (ref updated every render, no deps needed) ─
  const latestResumeRef = useRef<ResumeState | null>(null);
  latestResumeRef.current = {
    surahNumber,
    surahName: data?.surah.englishName ?? (name as string) ?? '',
    ayahNumber:
      currentTrack?.surahNumber === surahNumber && currentTrack.ayahNumber > 0
        ? currentTrack.ayahNumber
        : currentAyah,
    positionMs: currentTrack?.surahNumber === surahNumber ? position : 0,
    durationMs: currentTrack?.surahNumber === surahNumber ? duration : 0,
    mode:
      currentTrack?.surahNumber === surahNumber && (isPlaying || position > 500)
        ? 'listening'
        : 'reading',
    timestamp: Date.now(),
  };

  // ── Record surah visit for progress grid ─────────────────────────────────────
  useEffect(() => {
    if (data?.surah) {
      recordVisit(surahNumber, data.surah.englishName, 1);
    }
  }, [surahNumber, data?.surah?.englishName]);

  // ── Auto-scroll to resume ayah once data loads ────────────────────────────────
  useEffect(() => {
    if (!data || !resumeAyah || hasScrolledToResume.current) return;
    hasScrolledToResume.current = true;
    // Small delay so FlatList has rendered its items
    const t = setTimeout(() => scrollToAyah(resumeAyah), 350);
    return () => clearTimeout(t);
  }, [data, resumeAyah]);

  // ── Auto-restore audio when playlist is ready ─────────────────────────────────
  const playlist = useMemo<PlayerTrack[]>(() => {
    if (!data) return [];
    return data.ayahs
      .filter(a => !!a.audioUrl)
      .map(a => ({
        ayahNumber: a.numberInSurah,
        surahNumber,
        surahName: data.surah.englishName,
        arabic: a.arabic,
        transliteration: a.transliteration,
        translation: a.translation,
        audioUrl: a.audioUrl!,
      }));
  }, [data, surahNumber]);

  useEffect(() => {
    if (!resumePositionMs || !playlist.length || hasRestoredAudio.current) return;
    if (!resumeAyah) return;
    hasRestoredAudio.current = true;
    const idx = playlist.findIndex(t => t.ayahNumber === resumeAyah);
    if (idx >= 0) {
      loadAndPlay(playlist, idx, resumePositionMs);
    }
  }, [playlist, resumeAyah, resumePositionMs]);

  // ── Save resume state on key events ──────────────────────────────────────────

  // On unmount — flush immediately so we don't lose the last position
  useEffect(() => {
    return () => {
      if (latestResumeRef.current) {
        resumeService.saveImmediate(latestResumeRef.current);
      }
    };
  }, []);

  // On play/pause toggle
  const prevIsPlayingRef = useRef(isPlaying);
  useEffect(() => {
    const prev = prevIsPlayingRef.current;
    prevIsPlayingRef.current = isPlaying;
    if (prev !== isPlaying && latestResumeRef.current) {
      resumeService.save(latestResumeRef.current, 300);
    }
  }, [isPlaying]);

  // On track change (auto-advance or user action)
  useEffect(() => {
    if (currentTrack?.surahNumber === surahNumber && latestResumeRef.current) {
      resumeService.save(latestResumeRef.current, 300);
    }
  }, [currentTrack?.ayahNumber]);

  // On reading scroll (debounced longer — less urgent)
  useEffect(() => {
    if (latestResumeRef.current) {
      resumeService.save(latestResumeRef.current, 1500);
    }
  }, [currentAyah]);

  // ── Viewability ───────────────────────────────────────────────────────────────
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: AyahCombined }> }) => {
      if (viewableItems.length > 0) {
        setCurrentAyah(viewableItems[0].item.numberInSurah);
      }
    },
    [],
  );

  const scrollToAyah = useCallback((ayahNum: number) => {
    flatListRef.current?.scrollToIndex({
      index: ayahNum - 1,
      animated: true,
      viewPosition: 0,
    });
    setCurrentAyah(ayahNum);
  }, []);

  // ── Bookmark ──────────────────────────────────────────────────────────────────
  const toggleBookmark = useCallback(
    async (ayah: AyahCombined) => {
      if (checkBookmarked(surahNumber, ayah.numberInSurah)) {
        await removeBookmark(surahNumber, ayah.numberInSurah);
      } else {
        await addBookmark({
          surahNumber,
          surahName: data?.surah.englishName ?? name ?? '',
          ayahNumber: ayah.numberInSurah,
          arabic: ayah.arabic,
          transliteration: ayah.transliteration,
          translation: ayah.translation,
        });
      }
    },
    [checkBookmarked, surahNumber, addBookmark, removeBookmark],
  );

  // ── Play ──────────────────────────────────────────────────────────────────────
  const handlePlayAyah = useCallback(
    (ayah: AyahCombined) => {
      const isThisAyahActive =
        currentTrack?.surahNumber === surahNumber &&
        currentTrack?.ayahNumber === ayah.numberInSurah;
      if (isThisAyahActive) {
        playPause();
      } else {
        const startIndex = playlist.findIndex(t => t.ayahNumber === ayah.numberInSurah);
        if (startIndex >= 0) loadAndPlay(playlist, startIndex);
      }
    },
    [currentTrack, surahNumber, playPause, playlist, loadAndPlay],
  );

  // ── Render item ───────────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item, index }: { item: AyahCombined; index: number }) => {
      const isThisPlaying =
        currentTrack?.surahNumber === surahNumber &&
        currentTrack?.ayahNumber === item.numberInSurah &&
        isPlaying;
      return (
        <AyahCard
          ayah={item}
          isLast={index === (data?.ayahs.length ?? 0) - 1}
          bookmarked={checkBookmarked(surahNumber, item.numberInSurah)}
          isCurrentlyPlaying={isThisPlaying}
          onBookmark={() => toggleBookmark(item)}
          onPlay={() => handlePlayAyah(item)}
        />
      );
    },
    [data?.ayahs.length, checkBookmarked, toggleBookmark, currentTrack, surahNumber, isPlaying, handlePlayAyah],
  );

  // ── Picker data ───────────────────────────────────────────────────────────────
  const surahPickerItems =
    surahList?.map(s => ({
      label: s.englishName,
      value: s.number,
      sublabel: s.name,
    })) ?? [];

  const ayahPickerItems = Array.from(
    { length: data?.surah.numberOfAyahs ?? 0 },
    (_, i) => ({ label: `Ayah ${i + 1}`, value: i + 1 }),
  );

  const listHeader = data ? (
    <SurahHeroCard
      surah={data.surah}
      onSurahDropdownPress={() => setSurahPickerVisible(true)}
      onAyatDropdownPress={() => setAyahPickerVisible(true)}
    />
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.root}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.header}>
            <Image source={bgAuth} style={styles.headerBg} />

            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color={HOME_COLORS.teal} />
            </Pressable>

            <View style={styles.logoWrapper}>
              <Image source={logoAlQuran} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AY</Text>
            </View>
          </View>
        </SafeAreaView>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={HOME_COLORS.teal} />
            <Text style={styles.stateText}>Loading surah…</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.stateText}>Failed to load surah.</Text>
            <Pressable onPress={refetch} style={styles.retryBtn}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={data?.ayahs}
            keyExtractor={item => String(item.numberInSurah)}
            ListHeaderComponent={listHeader}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onScrollToIndexFailed={info => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            windowSize={7}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        )}
      </View>

      <SafeAreaView edges={['bottom']} className="bg-background" />

      <PickerModal
        visible={surahPickerVisible}
        title="Select Surah"
        items={surahPickerItems}
        selectedValue={surahNumber}
        onSelect={num => {
          setSurahPickerVisible(false);
          if (num !== surahNumber) {
            const selected = surahList?.find(s => s.number === num);
            router.replace(
              `/(main)/surah?number=${num}&name=${encodeURIComponent(selected?.englishName ?? '')}`,
            );
          }
        }}
        onDismiss={() => setSurahPickerVisible(false)}
      />

      <PickerModal
        visible={ayahPickerVisible}
        title="Jump to Ayah"
        items={ayahPickerItems}
        selectedValue={currentAyah}
        onSelect={num => {
          setAyahPickerVisible(false);
          scrollToAyah(num);
        }}
        onDismiss={() => setAyahPickerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white' },
  safeTop: { backgroundColor: '#C2EDEB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: '#C2EDEB',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  backBtn: { padding: 4, zIndex: 1 },
  logoWrapper: { flex: 1, alignItems: 'center', zIndex: 1 },
  logo: { height: 40, width: 140 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  avatarText: { color: 'white', fontSize: 12, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  stateText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, backgroundColor: HOME_COLORS.teal },
  retryText: { color: 'white', fontSize: 14, fontWeight: '600' },
  listContent: { flexGrow: 1 },
  listFooter: { height: 32 },
});
