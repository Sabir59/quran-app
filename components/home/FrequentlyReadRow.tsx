import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SurahSummary } from '@/api/quran/quran';
import { HOME_COLORS } from '@/constants/home';

interface FrequentlyReadRowProps {
  surahs: SurahSummary[];
  onPress: (surahNumber: number) => void;
}

export function FrequentlyReadRow({ surahs, onPress }: FrequentlyReadRowProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const titleColor = isDark ? '#9CA3AF' : 'white';
  const chipBg = isDark ? '#1F2937' : 'rgba(255,255,255,0.9)';
  const chipText = isDark ? HOME_COLORS.teal : HOME_COLORS.teal;

  if (surahs.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>Frequently Read</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {surahs.map(s => (
          <Pressable
            key={s.number}
            onPress={() => onPress(s.number)}
            style={({ pressed }) => [styles.chip, { backgroundColor: chipBg }, pressed && styles.chipPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Open ${s.englishName}`}
          >
            <Text style={[styles.chipText, { color: chipText }]}>{s.englishName}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 10,
    flexShrink: 0,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
