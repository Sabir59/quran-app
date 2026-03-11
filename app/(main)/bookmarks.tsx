import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { BookmarkCard } from '@/components/bookmarks/BookmarkCard';
import { HOME_COLORS } from '@/constants/home';
import { useBookmarks } from '@/context/BookmarksContext';
import type { Bookmark } from '@/lib/bookmarks';

const TEAL = HOME_COLORS.teal;

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ isSearching }: { isSearching: boolean }) {
  return (
    <View style={styles.emptyWrap}>
      <Ionicons name="bookmark-outline" size={56} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {isSearching ? 'No matches found' : 'No bookmarks yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isSearching
          ? 'Try a different surah name or ayah number.'
          : 'Tap the bookmark icon on any ayah while reading to save it here.'}
      </Text>
      {!isSearching && (
        <Pressable
          style={styles.browseBtn}
          onPress={() => router.push('/(main)/home')}
          accessibilityRole="button"
        >
          <Text style={styles.browseBtnText}>Browse Quran</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function BookmarksScreen() {
  const { bookmarks, isLoading, removeBookmark } = useBookmarks();
  const [query, setQuery] = useState('');

  const filtered = useMemo<Bookmark[]>(() => {
    if (!query.trim()) return bookmarks;
    const q = query.toLowerCase();
    return bookmarks.filter(
      b =>
        b.surahName.toLowerCase().includes(q) ||
        String(b.ayahNumber).includes(q) ||
        String(b.surahNumber).includes(q) ||
        (b.translation ?? '').toLowerCase().includes(q),
    );
  }, [bookmarks, query]);

  const handleCardPress = useCallback((b: Bookmark) => {
    router.push(`/(main)/surah?number=${b.surahNumber}&name=${encodeURIComponent(b.surahName)}`);
  }, []);

  const handleDelete = useCallback(
    (b: Bookmark) => removeBookmark(b.surahNumber, b.ayahNumber),
    [removeBookmark],
  );

  const renderItem = useCallback(
    ({ item }: { item: Bookmark }) => (
      <BookmarkCard
        bookmark={item}
        onPress={() => handleCardPress(item)}
        onDelete={() => handleDelete(item)}
      />
    ),
    [handleCardPress, handleDelete],
  );

  const keyExtractor = useCallback(
    (item: Bookmark) => `${item.surahNumber}-${item.ayahNumber}`,
    [],
  );

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.root}>
        {/* ── Teal header ── */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Bookmarks</Text>
            {bookmarks.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{bookmarks.length}</Text>
              </View>
            )}
          </View>

          {/* Search bar */}
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by surah or translation…"
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </SafeAreaView>

        {/* ── White content sheet ── */}
        <View style={styles.sheet}>
          {isLoading ? (
            <View style={styles.centerWrap}>
              <ActivityIndicator size="large" color={TEAL} />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListEmptyComponent={<EmptyState isSearching={query.length > 0} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              removeClippedSubviews
              initialNumToRender={10}
              maxToRenderPerBatch={8}
              windowSize={5}
            />
          )}
        </View>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.safeBottom} />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEAL,
  },
  safeTop: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    height: '100%',
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  browseBtn: {
    marginTop: 8,
    backgroundColor: TEAL,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  safeBottom: {
    backgroundColor: '#F9FAFB',
  },
});
