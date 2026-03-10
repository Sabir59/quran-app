import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { JuzEntry } from '@/constants/juz';
import { HOME_COLORS } from '@/constants/home';

interface JuzCardProps {
  juz: JuzEntry;
  label?: 'Juz' | 'Parah'; // Same data, different display label
  onPress: () => void;
}

export const JuzCard = memo(function JuzCard({ juz, label = 'Juz', onPress }: JuzCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${juz.number}`}
    >
      {/* Number pill */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{juz.number}</Text>
      </View>

      {/* Center */}
      <View style={styles.center}>
        <Text style={styles.title}>
          {label} {juz.number}
        </Text>
        <Text style={styles.startInfo}>
          Surah {juz.startSurah}, Ayah {juz.startAyah}
        </Text>
      </View>

      {/* Arabic name */}
      <Text style={styles.arabic}>{juz.arabicName}</Text>
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
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: HOME_COLORS.chipBg,
    borderWidth: 1.5,
    borderColor: HOME_COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  numberText: {
    fontSize: 15,
    fontWeight: '700',
    color: HOME_COLORS.purple,
  },
  center: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  startInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  arabic: {
    fontSize: 20,
    color: '#111827',
    marginLeft: 8,
    textAlign: 'right',
  },
});
