import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const revelation = REVELATION_DISPLAY[surah.revelationType] ?? surah.revelationType;
  const showBismillah = surah.number !== 9;

  return (
    <View style={styles.container}>
      {/* Arabic name */}
      <Text style={styles.arabicName}>{surah.name}</Text>

      {/* English name + translation */}
      <Text style={styles.englishRow}>
        <Text style={styles.englishName}>{surah.englishName} </Text>
        <Text style={styles.englishTranslation}>({surah.englishNameTranslation})</Text>
      </Text>

      {/* Chips row */}
      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <MaterialCommunityIcons name="map-marker-outline" size={12} color={HOME_COLORS.teal} />
          <Text style={styles.chipText}>{revelation}</Text>
        </View>
        <View style={styles.chipDot} />
        <View style={styles.chip}>
          <Ionicons name="document-text-outline" size={12} color={HOME_COLORS.teal} />
          <Text style={styles.chipText}>{surah.numberOfAyahs} Ayat</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Controls row */}
      <View style={styles.controlsRow}>
        {/* Surah dropdown */}
        <Pressable
          onPress={onSurahDropdownPress}
          style={styles.dropdownBtn}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {surah.englishName}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#374151" />
        </Pressable>

        {/* Ayat dropdown */}
        <Pressable
          onPress={onAyatDropdownPress}
          style={styles.dropdownBtn}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.dropdownText}>Ayat</Text>
          <Ionicons name="chevron-down" size={14} color="#374151" />
        </Pressable>

        {/* Read mode icon */}
        <View style={styles.readIcon}>
          <Ionicons name="book-outline" size={20} color={HOME_COLORS.teal} />
        </View>
      </View>

      {/* Bismillah */}
      {showBismillah ? (
        <Text style={styles.bismillah}>
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
      ) : null}

      <View style={styles.bottomDivider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  arabicName: {
    fontSize: 32,
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  englishRow: {
    marginBottom: 14,
    textAlign: 'center',
  },
  englishName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  englishTranslation: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
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
    backgroundColor: '#F0FFFE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#CCFAF8',
  },
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  chipText: {
    fontSize: 11,
    color: HOME_COLORS.teal,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
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
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    gap: 4,
  },
  dropdownText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  readIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bismillah: {
    fontSize: 24,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  bottomDivider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
});
