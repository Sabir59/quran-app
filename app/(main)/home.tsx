import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import type { SurahSummary } from '@/api/quran/quran';
import { FrequentlyReadRow } from '@/components/home/FrequentlyReadRow';
import { HomeHero } from '@/components/home/HomeHero';
import { JuzCard } from '@/components/home/JuzCard';
import { ModeTabsRow } from '@/components/home/ModeTabsRow';
import { SearchBar } from '@/components/home/SearchBar';
import { SurahCard } from '@/components/home/SurahCard';
import {
  DEFAULT_SORT_FILTER,
  FilterSortModal,
} from '@/components/home/FilterSortModal';
import type { HomeMode } from '@/components/home/ModeTabsRow';
import type { SortFilterState } from '@/components/home/FilterSortModal';
import { HOME_COLORS } from '@/constants/home';
import { JUZ_DATA } from '@/constants/juz';
import type { JuzEntry } from '@/constants/juz';
import { useSurahList } from '@/hooks/api/quran';
import { useFrequentlyRead } from '@/hooks/useFrequentlyRead';
import { useHomeSearch } from '@/hooks/useHomeSearch';

// ─── List item union type ────────────────────────────────────────────────────
type SurahItem = { type: 'surah'; data: SurahSummary };
type JuzItem = { type: 'juz'; data: JuzEntry };
type ListItem = SurahItem | JuzItem;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function applySortFilter(surahs: SurahSummary[], sf: SortFilterState): SurahSummary[] {
  let out = sf.revelation === 'all'
    ? surahs
    : surahs.filter(s => s.revelationType === sf.revelation);

  switch (sf.sort) {
    case 'number_asc':  return out; // API default order
    case 'number_desc': return [...out].reverse();
    case 'name_asc':    return [...out].sort((a, b) => a.englishName.localeCompare(b.englishName));
    default:            return out;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EmptyState({
  isLoading,
  isError,
  onRetry,
  isSearching,
  query,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isSearching: boolean;
  query: string;
}) {
  if (isLoading) {
    return (
      <View style={emptyStyles.center}>
        <ActivityIndicator size="large" color={HOME_COLORS.teal} />
        <Text style={emptyStyles.text}>Loading surahs…</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={emptyStyles.center}>
        <Text style={emptyStyles.text}>Failed to load surahs.</Text>
        <Pressable onPress={onRetry} style={emptyStyles.retryBtn}>
          <Text style={emptyStyles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
  if (isSearching) {
    return (
      <View style={emptyStyles.center}>
        <Text style={emptyStyles.text}>No results for "{query}"</Text>
      </View>
    );
  }
  return null;
}

const emptyStyles = StyleSheet.create({
  center: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 14,
  },
  text: {
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
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { data: surahs, isLoading, isError, refetch } = useSurahList();
  const { query, setQuery, results, isSearching } = useHomeSearch(surahs);
  const { frequentSurahs, trackRead } = useFrequentlyRead(surahs ?? []);

  const [mode, setMode] = useState<HomeMode>('Surat');
  const [sortFilter, setSortFilter] = useState<SortFilterState>(DEFAULT_SORT_FILTER);
  const [filterVisible, setFilterVisible] = useState(false);

  // Navigate to surah detail
  const handleSurahPress = useCallback(
    (surah: SurahSummary) => {
      trackRead(surah.number);
      router.push(
        `/(main)/surah?number=${surah.number}&name=${encodeURIComponent(surah.englishName)}`,
      );
    },
    [trackRead],
  );

  // Navigate to start surah of a Juz
  const handleJuzPress = useCallback((juz: JuzEntry) => {
    const surah = juz.startSurah;
    router.push(`/(main)/surah?number=${surah}&name=Juz+${juz.number}`);
  }, []);

  // Tap on a Frequently Read chip
  const handleFrequentPress = useCallback(
    (surahNumber: number) => {
      const surah = surahs?.find(s => s.number === surahNumber);
      if (surah) handleSurahPress(surah);
    },
    [surahs, handleSurahPress],
  );

  // Build the FlatList data
  const listData = useMemo<ListItem[]>(() => {
    if (mode !== 'Surat') {
      return JUZ_DATA.map(j => ({ type: 'juz', data: j }));
    }
    const base = isSearching ? (results ?? []) : (surahs ?? []);
    return applySortFilter(base, sortFilter).map(s => ({ type: 'surah', data: s }));
  }, [mode, surahs, results, isSearching, sortFilter]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'surah') {
        return <SurahCard surah={item.data} onPress={() => handleSurahPress(item.data)} />;
      }
      return (
        <JuzCard
          juz={item.data}
          label={mode === 'Parah' ? 'Parah' : 'Juz'}
          onPress={() => handleJuzPress(item.data)}
        />
      );
    },
    [handleSurahPress, handleJuzPress, mode],
  );

  const keyExtractor = useCallback(
    (item: ListItem) =>
      item.type === 'surah' ? `s-${item.data.number}` : `j-${item.data.number}`,
    [],
  );

  // ModeTabsRow is ListHeaderComponent of the FlatList (inside the white card)
  const ListHeader = useMemo(
    () => (
      <ModeTabsRow
        mode={mode}
        onModeChange={setMode}
        onFilterPress={() => setFilterVisible(true)}
      />
    ),
    [mode],
  );

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Teal outer shell — bleeds behind the status bar */}
      <View style={styles.root}>
        <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>

          {/* ── Fixed teal header ──────────────────────────────────── */}
          <HomeHero />
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
          />
          <FrequentlyReadRow surahs={frequentSurahs} onPress={handleFrequentPress} />

        </SafeAreaView>

        {/* ── White content sheet — overlaps teal by 20px ─────────── */}
        <View style={styles.contentSheet}>
          <FlatList
            data={listData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={
              <EmptyState
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                isSearching={isSearching}
                query={query}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            removeClippedSubviews
            initialNumToRender={14}
            maxToRenderPerBatch={10}
            windowSize={7}
            getItemLayout={
              // Only valid when mode is Surat (fixed card height ~82px)
              mode === 'Surat'
                ? (_, index) => ({ length: 82, offset: 82 * index, index })
                : undefined
            }
          />
        </View>
      </View>

      {/* Bottom safe area — white to match the list */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom} />

      {/* Filter / Sort modal */}
      <FilterSortModal
        visible={filterVisible}
        state={sortFilter}
        onApply={state => {
          setSortFilter(state);
          setFilterVisible(false);
        }}
        onDismiss={() => setFilterVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HOME_COLORS.teal,
  },
  safeTop: {
    backgroundColor: 'transparent',
  },
  contentSheet: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    // marginTop: -20,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 4,
  },
  safeBottom: {
    backgroundColor: 'white',
  },
});
