import { Ionicons } from '@expo/vector-icons';
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
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {MODES.map(m => (
          <Pressable
            key={m}
            onPress={() => onModeChange(m)}
            style={[styles.tab, mode === m && styles.tabSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === m }}
            accessibilityLabel={`${m} mode`}
          >
            <Text style={[styles.tabText, mode === m && styles.tabTextSelected]}>
              {m}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={onFilterPress}
        style={styles.filterBtn}
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
    borderBottomColor: '#E5E7EB',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  tabSelected: {
    backgroundColor: HOME_COLORS.selectedTabBg,
    borderColor: HOME_COLORS.selectedTabBg,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextSelected: {
    color: HOME_COLORS.selectedTabText,
    fontWeight: '700',
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
