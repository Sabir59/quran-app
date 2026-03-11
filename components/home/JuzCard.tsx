import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { JuzEntry } from '@/constants/juz';
import { HOME_COLORS } from '@/constants/home';

interface JuzCardProps {
  juz: JuzEntry;
  label?: 'Juz' | 'Parah';
  onPress: () => void;
}

export const JuzCard = memo(function JuzCard({ juz, label = 'Juz', onPress }: JuzCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.layout, pressed && styles.pressed]}
      className="bg-card mx-4 mb-[10px] rounded-[14px]"
      accessibilityRole="button"
      accessibilityLabel={`${label} ${juz.number}`}
    >
      {/* Number pill */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{juz.number}</Text>
      </View>

      {/* Center */}
      <View style={styles.center}>
        <Text className="text-[14px] font-bold text-foreground">
          {label} {juz.number}
        </Text>
        <Text className="text-[12px] text-muted-foreground">
          Surah {juz.startSurah}, Ayah {juz.startAyah}
        </Text>
      </View>

      {/* Arabic name */}
      <Text className="text-[20px] text-foreground ml-2 text-right">{juz.arabicName}</Text>
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
  center: { flex: 1, gap: 4 },
});
