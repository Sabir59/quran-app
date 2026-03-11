import { useCallback, useMemo, useRef, useState } from 'react';
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

const bgAuth = require('@/assets/images/bg-auth.png');
const logoAlQuran = require('@/assets/images/logo-al-quran.png');

export default function SurahScreen() {
  const { number, name } = useLocalSearchParams<{ number: string; name: string }>();
  const surahNumber = Number(number);

  const { data, isLoading, isError, refetch } = useSurahDetail({
    surahNumber,
    mushaf: 'uthmani',
    translationEnabled: true,
  });
  const { data: surahList } = useSurahList();
  const { isBookmarked: checkBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { loadAndPlay, playPause, currentTrack, isPlaying } = useAudioPlayer();

  const [currentAyah, setCurrentAyah] = useState(1);
  const [surahPickerVisible, setSurahPickerVisible] = useState(false);
  const [ayahPickerVisible, setAyahPickerVisible] = useState(false);

  const flatListRef = useRef<FlatList<AyahCombined>>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

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

  // Build playlist from loaded ayahs (only those with audio)
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

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.root}>
        {/* ── Logo header (white with faint bg image) ── */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.header}>
            {/* Faint background */}
            <Image source={bgAuth} style={styles.headerBg} />

            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color={HOME_COLORS.teal} />
            </Pressable>

            {/* Logo centered */}
            <View style={styles.logoWrapper}>
              <Image source={logoAlQuran} style={styles.logo} resizeMode="contain" />
            </View>

            {/* AY avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AY</Text>
            </View>
          </View>
        </SafeAreaView>

        {/* ── Content ── */}
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

      {/* Surah switcher */}
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

      {/* Ayah jumper */}
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
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeTop: {
    backgroundColor: '#C2EDEB',
  },
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
  backBtn: {
    padding: 4,
    zIndex: 1,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    height: 40,
    width: 140,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  stateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: HOME_COLORS.teal,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  listFooter: {
    height: 32,
  },
  safeBottom: {
    backgroundColor: 'white',
  },
});
