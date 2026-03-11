import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { useColorScheme } from 'nativewind';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SurahSummary } from '@/api/quran/quran';
import { HOME_COLORS, REVELATION_DISPLAY } from '@/constants/home';

interface SurahCardProps {
  surah: SurahSummary;
  onPress: () => void;
}

export const SurahCard = memo(function SurahCard({ surah, onPress }: SurahCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const revelation = REVELATION_DISPLAY[surah.revelationType] ?? surah.revelationType;
  const chipBg = isDark ? 'rgba(168,85,247,0.15)' : HOME_COLORS.chipBg;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.layout, pressed && styles.pressed]}
      className="bg-card mx-4 mb-[10px] rounded-[14px]"
      accessibilityRole="button"
      accessibilityLabel={`${surah.englishName}, surah ${surah.number}`}
    >
      {/* Numbered octagram badge */}
      <View style={styles.badge}>
        <MaterialCommunityIcons name="octagram-outline" size={44} color={HOME_COLORS.surahBadge} />
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.badgeCenter}>
            <Text className="text-[11px] font-extrabold text-foreground">{surah.number}</Text>
          </View>
        </View>
      </View>

      {/* Name + chips */}
      <View style={styles.center}>
        <View style={styles.nameRow}>
          <Text className="text-[14px] font-bold text-foreground" numberOfLines={1}>
            {surah.englishName}
          </Text>
          <Text className="text-[12px] italic text-muted-foreground" numberOfLines={1}>
            {' '}({surah.englishNameTranslation})
          </Text>
        </View>
        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: chipBg }]}>
            <Ionicons name="location-outline" size={11} color={HOME_COLORS.chipIcon} />
            <Text className="text-[10px] font-medium text-muted-foreground">{revelation}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: chipBg }]}>
            <Ionicons name="document-text-outline" size={11} color={HOME_COLORS.chipIcon} />
            <Text className="text-[10px] font-medium text-muted-foreground">{surah.numberOfAyahs} Ayat</Text>
          </View>
        </View>
      </View>

      {/* Arabic name */}
      <Text className="text-[18px] text-foreground ml-2 text-right">{surah.name}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: { opacity: 0.85 },
  badge: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  badgeCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 },
});
