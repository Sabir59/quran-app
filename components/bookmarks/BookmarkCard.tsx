import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Bookmark } from '@/lib/bookmarks';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onPress: () => void;
  onDelete: () => void;
}

const TEAL = '#12C4BE';
const TEAL_LIGHT = '#ECFAF9';
const TEAL_BADGE_TEXT = '#0D9E99';

export function BookmarkCard({ bookmark, onPress, onDelete }: BookmarkCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Bookmark: ${bookmark.surahName} ayah ${bookmark.ayahNumber}`}
    >
      {/* Teal left accent bar */}
      <View style={styles.accent} />

      <View style={styles.body}>
        {/* Header row — surah badge + ayah number + delete */}
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons name="bookmark" size={11} color={TEAL_BADGE_TEXT} />
            <Text style={styles.badgeText}>
              {bookmark.surahName} · {bookmark.ayahNumber}
            </Text>
          </View>

          <Pressable
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Remove bookmark"
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={17} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Arabic text */}
        <Text style={styles.arabic} numberOfLines={3}>
          {bookmark.arabic}
        </Text>

        {/* Transliteration */}
        {bookmark.transliteration ? (
          <Text style={styles.transliteration} numberOfLines={2}>
            {bookmark.transliteration}
          </Text>
        ) : null}

        {/* Translation */}
        {bookmark.translation ? (
          <Text style={styles.translation} numberOfLines={3}>
            {bookmark.ayahNumber}. {bookmark.translation}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: TEAL_LIGHT,
  },
  accent: {
    width: 4,
    backgroundColor: TEAL,
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: TEAL_BADGE_TEXT,
  },
  deleteBtn: {
    padding: 2,
  },
  arabic: {
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#111827',
    fontWeight: '500',
  },
  transliteration: {
    fontSize: 13,
    fontStyle: 'italic',
    color: TEAL,
    lineHeight: 20,
  },
  translation: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});
