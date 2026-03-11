import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HOME_COLORS } from '@/constants/home';

export type HomeMode = 'Surat' | 'Juz' | 'Parah';
const MODES: HomeMode[] = ['Surat', 'Juz', 'Parah'];

interface ModeTabsRowProps {
  mode: HomeMode;
  onModeChange: (mode: HomeMode) => void;
  onFilterPress: () => void;
}

export function ModeTabsRow({ mode, onModeChange, onFilterPress }: ModeTabsRowProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const borderColor = isDark ? '#252628' : '#E5E7EB';

  return (
    <View
      style={[styles.container, { borderBottomColor: borderColor }]}
      className="bg-background"
    >
      <View style={styles.tabs}>
        {MODES.map(m => {
          const selected = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => onModeChange(m)}
              style={[
                styles.tab,
                { borderColor: selected ? HOME_COLORS.selectedTabBg : borderColor },
                selected
                  ? { backgroundColor: HOME_COLORS.selectedTabBg }
                  : undefined,
              ]}
              className={selected ? '' : 'bg-card'}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${m} mode`}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: selected ? HOME_COLORS.selectedTabText : (isDark ? '#9CA3AF' : '#6B7280') },
                  selected && styles.tabTextSelected,
                ]}
              >
                {m}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onFilterPress}
        style={[styles.filterBtn, { borderColor: HOME_COLORS.teal }]}
        accessibilityRole="button"
        accessibilityLabel="Sort and filter"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="options-outline" size={20} color={HOME_COLORS.teal} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tabText: { fontSize: 13, fontWeight: '500' },
  tabTextSelected: { fontWeight: '700' },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
