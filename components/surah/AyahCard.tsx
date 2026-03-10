import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AyahCombined } from '@/api/quran/quran';
import { HOME_COLORS } from '@/constants/home';

interface AyahCardProps {
  ayah: AyahCombined;
  isLast: boolean;
  bookmarked: boolean;
  isCurrentlyPlaying: boolean;
  onBookmark: () => void;
  onPlay: () => void;
}

export const AyahCard = memo(function AyahCard({
  ayah,
  isLast,
  bookmarked,
  isCurrentlyPlaying,
  onBookmark,
  onPlay,
}: AyahCardProps) {
  return (
    <View style={[styles.card, !isLast && styles.cardBorder, isCurrentlyPlaying && styles.cardActive]}>
      {/* Arabic text — right-aligned, large */}
      <Text style={styles.arabic}>{ayah.arabic}</Text>

      {/* Transliteration */}
      {ayah.transliteration ? (
        <Text style={styles.transliteration}>{ayah.transliteration}</Text>
      ) : null}

      {/* Numbered translation */}
      {ayah.translation ? (
        <Text style={styles.translation}>
          {ayah.numberInSurah}. {ayah.translation}
        </Text>
      ) : null}

      {/* Action buttons row */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={onPlay}
          style={styles.actionBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isCurrentlyPlaying ? 'Playing' : 'Play ayah'}
        >
          <Ionicons
            name={isCurrentlyPlaying ? 'pause-circle' : 'play-circle'}
            size={22}
            color={HOME_COLORS.teal}
          />
        </Pressable>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="share-social-outline" size={18} color={HOME_COLORS.teal} />
        </Pressable>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="copy-outline" size={18} color={HOME_COLORS.teal} />
        </Pressable>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="albums-outline" size={18} color={HOME_COLORS.teal} />
        </Pressable>
        <Pressable
          onPress={onBookmark}
          style={styles.actionBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={HOME_COLORS.teal}
          />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  cardBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  cardActive: {
    backgroundColor: '#F0FFFE',
  },
  arabic: {
    fontSize: 24,
    color: '#111827',
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 10,
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 13,
    color: HOME_COLORS.teal,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  translation: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
});
