import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SurahSummary } from '@/api/quran/quran';

interface FrequentlyReadRowProps {
  surahs: SurahSummary[];
  onPress: (surahNumber: number) => void;
}

export function FrequentlyReadRow({ surahs, onPress }: FrequentlyReadRowProps) {
  if (surahs.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently Read</Text>
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
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Open ${s.englishName}`}
          >
            <Text style={styles.chipText}>{s.englishName}</Text>
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
    color: 'white',
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    color: '#12C4BE',
    fontSize: 13,
    fontWeight: '600',
  },
});
