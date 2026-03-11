import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SurahSummary } from '@/api/quran/quran';
import { HOME_COLORS, REVELATION_DISPLAY } from '@/constants/home';

interface SurahHeroCardProps {
  surah: SurahSummary;
  onSurahDropdownPress: () => void;
  onAyatDropdownPress: () => void;
}

export function SurahHeroCard({
  surah,
  onSurahDropdownPress,
  onAyatDropdownPress,
}: SurahHeroCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const revelation = REVELATION_DISPLAY[surah.revelationType] ?? surah.revelationType;
  const showBismillah = surah.number !== 9;

  // Teal-tinted chip — adapted for dark mode
  const chipBg = isDark ? 'rgba(18,196,190,0.12)' : '#F0FFFE';
  const chipBorder = isDark ? 'rgba(18,196,190,0.25)' : '#CCFAF8';
  const borderColor = isDark ? '#252628' : '#E5E7EB';

  return (
    <View className="bg-background" style={styles.container}>
      {/* Arabic name */}
      <Text className="text-[32px] text-foreground text-center mb-[6px]">{surah.name}</Text>

      {/* English name + translation */}
      <Text className="text-center mb-[14px]">
        <Text className="text-[15px] font-bold text-foreground">{surah.englishName} </Text>
        <Text className="text-[14px] italic text-muted-foreground">({surah.englishNameTranslation})</Text>
      </Text>

      {/* Chips */}
      <View style={styles.chipsRow}>
        <View style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}>
          <MaterialCommunityIcons name="map-marker-outline" size={12} color={HOME_COLORS.teal} />
          <Text style={styles.chipText}>{revelation}</Text>
        </View>
        <View style={[styles.chipDot, { backgroundColor: borderColor }]} />
        <View style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}>
          <Ionicons name="document-text-outline" size={12} color={HOME_COLORS.teal} />
          <Text style={styles.chipText}>{surah.numberOfAyahs} Ayat</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      {/* Controls row */}
      <View style={styles.controlsRow}>
        <Pressable
          onPress={onSurahDropdownPress}
          style={[styles.dropdownBtn, { borderColor }]}
          className="bg-muted"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text className="flex-1 text-[13px] font-semibold text-foreground" numberOfLines={1}>
            {surah.englishName}
          </Text>
          <Ionicons name="chevron-down" size={14} color={isDark ? '#9CA3AF' : '#374151'} />
        </Pressable>

        <Pressable
          onPress={onAyatDropdownPress}
          style={[styles.dropdownBtn, { borderColor }]}
          className="bg-muted"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text className="flex-1 text-[13px] font-semibold text-foreground">Ayat</Text>
          <Ionicons name="chevron-down" size={14} color={isDark ? '#9CA3AF' : '#374151'} />
        </Pressable>

        <View style={[styles.readIcon, { borderColor }]} className="bg-muted">
          <Ionicons name="book-outline" size={20} color={HOME_COLORS.teal} />
        </View>
      </View>

      {/* Bismillah */}
      {showBismillah ? (
        <Text className="text-[24px] text-foreground text-center mb-2" style={styles.bismillah}>
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
      ) : null}

      <View style={[styles.bottomDivider, { backgroundColor: borderColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  chipText: {
    fontSize: 11,
    color: HOME_COLORS.teal,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  dropdownBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  readIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bismillah: {
    lineHeight: 48,
    writingDirection: 'rtl',
  },
  bottomDivider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
});
