import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  InteractionManager,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { scrollTarget } from '@/services/scrollTarget';

const bgAuth = require('@/assets/images/bg-auth.png');
const logoAlQuran = require('@/assets/images/logo-al-quran.png');

// Used by getItemLayout so scrollToIndex can reach any item without pre-rendering
const AYAH_ESTIMATED_HEIGHT = 220;

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
    loadAndPlay, playPause, currentTrack, isPlaying, position, duration, openPlayerModal,
  } = useAudioPlayer();
  const { recordVisit } = useProgress();

  const [currentAyah, setCurrentAyah] = useState(1);
  const [resumedAyah, setResumedAyah] = useState(0); // set when scrollTarget is consumed
  const [surahPickerVisible, setSurahPickerVisible] = useState(false);
  const [ayahPickerVisible, setAyahPickerVisible] = useState(false);

  const flatListRef = useRef<FlatList<AyahCombined>>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  // ── Preserve last audio position across stop() clearing currentTrack ─────────
  // stop() clears currentTrack + position in one React batch. By the time effects
  // run (saving resume state), currentTrack is already null. This ref captures the
  // last known audio position inline every render — survives the state clearing.
  const lastAudioRef = useRef<{ ayahNumber: number; positionMs: number } | null>(null);
  if (currentTrack?.surahNumber === surahNumber && currentTrack.ayahNumber > 0) {
    lastAudioRef.current = { ayahNumber: currentTrack.ayahNumber, positionMs: position };
  }

  // ── Always-current state snapshot (ref updated every render, no deps needed) ─
  const latestResumeRef = useRef<ResumeState | null>(null);
  latestResumeRef.current = {
    surahNumber,
    surahName: data?.surah.englishName ?? (name as string) ?? '',
    ayahNumber:
      currentTrack?.surahNumber === surahNumber && currentTrack.ayahNumber > 0
        ? currentTrack.ayahNumber
        : (lastAudioRef.current?.ayahNumber ?? currentAyah),
    positionMs: currentTrack?.surahNumber === surahNumber
      ? position
      : (lastAudioRef.current?.positionMs ?? 0),
    durationMs: currentTrack?.surahNumber === surahNumber ? duration : 0,
    mode:
      currentTrack?.surahNumber === surahNumber && (isPlaying || position > 500)
        ? 'listening'
        : 'reading',
    timestamp: Date.now(),
  };

  // Reset last audio position when navigating to a different surah
  useEffect(() => { lastAudioRef.current = null; }, [surahNumber]);

  // ── Record surah visit for progress grid ─────────────────────────────────────
  useEffect(() => {
    if (data?.surah) {
      recordVisit(surahNumber, data.surah.englishName, 1);
    }
  }, [surahNumber, data?.surah?.englishName]);

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

  // ── Consume resume target (scroll + optional audio) ───────────────────────────
  // Stored in module-level scrollTarget to guarantee delivery regardless of
  // whether Expo Router actually updates useLocalSearchParams for this Tab.Screen.
  //
  // Two trigger points:
  //  1. useFocusEffect — screen gains focus, data already in cache → scroll immediately
  //  2. useEffect([data]) — data loads from network AFTER screen is already focused
  //
  // A ref is used so both triggers share a stable function without stale closures.
  const consumeScrollTargetRef = useRef<() => void>(() => {});
  consumeScrollTargetRef.current = () => {
    if (!data) return;
    const target = scrollTarget.get();
    if (!target || target.surahNumber !== surahNumber) return;
    scrollTarget.clear(); // clear first — prevents double-run from useFocusEffect + useEffect([data])

    // Mark this ayah for the pulse highlight
    setResumedAyah(target.ayahNumber);

    // Scroll to the target ayah
    if (target.ayahNumber > 1) {
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToOffset({
          offset: (target.ayahNumber - 1) * AYAH_ESTIMATED_HEIGHT,
          animated: true,
        });
        setCurrentAyah(target.ayahNumber);
      });
    }

    // Always open player — load at saved position without auto-playing
    if (target.openPlayer && playlist.length > 0) {
      const idx = playlist.findIndex(t => t.ayahNumber === target.ayahNumber);
      const startIdx = idx >= 0 ? idx : 0;
      loadAndPlay(playlist, startIdx, target.positionMs, false);
      openPlayerModal();
    }
  };

  // Trigger 1: screen gains focus (handles cached data case)
  useFocusEffect(useCallback(() => { consumeScrollTargetRef.current(); }, []));

  // Trigger 2: data arrives from network (handles first-visit case)
  useEffect(() => { consumeScrollTargetRef.current(); }, [data, surahNumber]);

  // ── Save resume state on key events ──────────────────────────────────────────

  // On blur (tab switch or screen leave) — flush immediately so quran.tsx gets fresh data
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (latestResumeRef.current) {
          resumeService.saveImmediate(latestResumeRef.current);
        }
      };
    }, []),
  );

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
      viewPosition: 0.1,
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
          isResumeTarget={!!resumedAyah && item.numberInSurah === resumedAyah}
          onBookmark={() => toggleBookmark(item)}
          onPlay={() => handlePlayAyah(item)}
        />
      );
    },
    [data?.ayahs.length, checkBookmarked, toggleBookmark, currentTrack, surahNumber, isPlaying, handlePlayAyah, resumedAyah],
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
            // Estimated item height — lets scrollToIndex reach un-rendered items
            getItemLayout={(_, index) => ({
              length: AYAH_ESTIMATED_HEIGHT,
              offset: AYAH_ESTIMATED_HEIGHT * index,
              index,
            })}
            onScrollToIndexFailed={info => {
              // Fallback: scroll to approximate offset then retry after render
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
            }}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            windowSize={7}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        )}
      </View>

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
