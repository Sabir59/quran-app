import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Bookmark } from '@/lib/bookmarks';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onPress: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const TEAL = '#12C4BE';
const TEAL_LIGHT = '#ECFAF9';
const TEAL_BADGE_TEXT = '#0D9E99';

export function BookmarkCard({ bookmark, onPress, onDelete, isDeleting = false }: BookmarkCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardShadow, pressed && styles.cardPressed]}
      className="flex-row bg-card mx-4 mb-3 rounded-2xl overflow-hidden"
      accessibilityRole="button"
      accessibilityLabel={`Bookmark: ${bookmark.surahName} ayah ${bookmark.ayahNumber}`}
    >
      {/* Teal left accent bar — brand color, always teal */}
      <View style={styles.accent} />

      <View style={styles.body}>
        {/* Header row */}
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
            disabled={isDeleting}
          >
            {isDeleting
              ? <ActivityIndicator size="small" color="#9CA3AF" />
              : <Ionicons name="trash-outline" size={17} color="#9CA3AF" />
            }
          </Pressable>
        </View>

        {/* Arabic text */}
        <Text
          className="text-[20px] leading-[36px] text-right text-foreground font-medium"
          style={styles.rtl}
          numberOfLines={3}
        >
          {bookmark.arabic}
        </Text>

        {/* Transliteration — brand teal, works on both light and dark */}
        {bookmark.transliteration ? (
          <Text style={styles.transliteration} numberOfLines={2}>
            {bookmark.transliteration}
          </Text>
        ) : null}

        {/* Translation */}
        {bookmark.translation ? (
          <Text className="text-[13px] text-muted-foreground leading-5" numberOfLines={3}>
            {bookmark.ayahNumber}. {bookmark.translation}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
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
  rtl: {
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 13,
    fontStyle: 'italic',
    color: TEAL,
    lineHeight: 20,
  },
});
