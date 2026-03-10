import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SurahSummary } from '@/api/quran/quran';
import { HOME_COLORS, REVELATION_DISPLAY } from '@/constants/home';

interface SurahCardProps {
  surah: SurahSummary;
  onPress: () => void;
}

export const SurahCard = memo(function SurahCard({ surah, onPress }: SurahCardProps) {
  const revelation = REVELATION_DISPLAY[surah.revelationType] ?? surah.revelationType;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${surah.englishName}, surah ${surah.number}`}
    >
      {/* Left: numbered octagram badge */}
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name="octagram-outline"
          size={44}
          color={HOME_COLORS.surahBadge}
        />
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.badgeInner}>
            <Text style={styles.badgeNumber}>{surah.number}</Text>
          </View>
        </View>
      </View>

      {/* Center: name + translation + chips */}
      <View style={styles.center}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {surah.englishName}
          </Text>
          <Text style={styles.translation} numberOfLines={1}>
            {' '}({surah.englishNameTranslation})
          </Text>
        </View>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Ionicons name="location-outline" size={11} color={HOME_COLORS.chipIcon} />
            <Text style={styles.chipText}>{revelation}</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="document-text-outline" size={11} color={HOME_COLORS.chipIcon} />
            <Text style={styles.chipText}>{surah.numberOfAyahs} Ayat</Text>
          </View>
        </View>
      </View>

      {/* Right: Arabic name */}
      <Text style={styles.arabic}>{surah.name}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
  },
  badge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
  },
  center: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  translation: {
    fontSize: 12,
    color: HOME_COLORS.cardSubtitle,
    fontStyle: 'italic',
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: HOME_COLORS.chipBg,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 10,
    color: HOME_COLORS.chipText,
    fontWeight: '500',
  },
  arabic: {
    fontSize: 18,
    color: '#111827',
    marginLeft: 8,
    textAlign: 'right',
  },
});
