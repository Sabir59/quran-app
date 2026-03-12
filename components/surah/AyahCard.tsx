import { memo, useEffect, useRef } from 'react';
import { useColorScheme } from 'nativewind';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AyahCombined } from '@/api/quran/quran';
import { HOME_COLORS } from '@/constants/home';

interface AyahCardProps {
  ayah: AyahCombined;
  isLast: boolean;
  bookmarked: boolean;
  isCurrentlyPlaying: boolean;
  isResumeTarget?: boolean;
  onBookmark: () => void;
  onPlay: () => void;
}

export const AyahCard = memo(function AyahCard({
  ayah,
  isLast,
  bookmarked,
  isCurrentlyPlaying,
  isResumeTarget = false,
  onBookmark,
  onPlay,
}: AyahCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Colors computed from scheme — no hardcoding
  const activeBg = isDark ? 'rgba(18,196,190,0.08)' : '#F0FFFE';
  const borderColor = isDark ? '#252628' : '#E5E7EB'; // matches CSS --border variable

  // Resume target: pulse teal border then fade away
  const pulseAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isResumeTarget) return;
    pulseAnim.setValue(0);
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 0.5, duration: 300, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 0.5, duration: 300, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
    ]).start();
  }, [isResumeTarget]);

  const resumeBorderColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', HOME_COLORS.teal],
  });
  const resumeBg = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', isDark ? 'rgba(18,196,190,0.12)' : 'rgba(18,196,190,0.08)'],
  });

  return (
    <Animated.View
      className="bg-background"
      style={[
        styles.layout,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
        isCurrentlyPlaying && { backgroundColor: activeBg },
        isResumeTarget && { borderWidth: 2, borderColor: resumeBorderColor, backgroundColor: resumeBg, borderRadius: 8 },
      ]}
    >
      {/* Arabic */}
      <Text
        className="text-[24px] text-foreground text-right mb-[10px]"
        style={styles.arabicLine}
      >
        {ayah.arabic}
      </Text>

      {/* Transliteration — teal brand color on both light/dark */}
      {ayah.transliteration ? (
        <Text style={styles.transliteration}>{ayah.transliteration}</Text>
      ) : null}

      {/* Translation */}
      {ayah.translation ? (
        <Text className="text-[13px] text-muted-foreground leading-[22px] mb-4">
          {ayah.numberInSurah}. {ayah.translation}
        </Text>
      ) : null}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable onPress={onPlay} style={styles.actionBtn} hitSlop={8} accessibilityRole="button">
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
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  layout: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  arabicLine: {
    lineHeight: 48,
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 13,
    color: HOME_COLORS.teal,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsRow: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 6 },
});
