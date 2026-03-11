import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { HOME_COLORS } from '@/constants/home';

export type SortType = 'number_asc' | 'number_desc' | 'name_asc';
export type RevelationFilter = 'all' | 'Meccan' | 'Medinan';

export type SortFilterState = {
  sort: SortType;
  revelation: RevelationFilter;
};

export const DEFAULT_SORT_FILTER: SortFilterState = {
  sort: 'number_asc',
  revelation: 'all',
};

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: 'number_asc', label: 'Number: 1 → 114' },
  { value: 'number_desc', label: 'Number: 114 → 1' },
  { value: 'name_asc', label: 'Name: A → Z' },
];

const REVELATION_OPTIONS: { value: RevelationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Meccan', label: 'Makkiyah' },
  { value: 'Medinan', label: 'Madaniyah' },
];

interface FilterSortModalProps {
  visible: boolean;
  state: SortFilterState;
  onApply: (state: SortFilterState) => void;
  onDismiss: () => void;
}

export function FilterSortModal({ visible, state, onApply, onDismiss }: FilterSortModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const sheetBg = isDark ? '#0a0a0f' : 'white'; // Animated.View doesn't support className
  const borderColor = isDark ? '#252628' : '#E5E7EB';
  const handleColor = isDark ? '#374151' : '#D1D5DB';

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, bounciness: 4 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible, slideAnim, state]);

  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });
  const [localState, setLocalState] = useLocalState(state, visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sheetLayout, { backgroundColor: sheetBg, transform: [{ translateY }] }]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: handleColor }]} />

        <Text className="text-[17px] font-bold text-foreground mb-5">Sort &amp; Filter</Text>

        {/* Sort */}
        <Text className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest mb-[10px]">
          Sort by
        </Text>
        <View style={styles.optionsRow}>
          {SORT_OPTIONS.map(opt => {
            const selected = localState.sort === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setLocalState(prev => ({ ...prev, sort: opt.value }))}
                style={[
                  styles.optionBtn,
                  { borderColor: selected ? HOME_COLORS.teal : borderColor },
                  selected ? { backgroundColor: '#ECFAF9' } : undefined,
                ]}
                className={selected ? '' : 'bg-muted'}
              >
                <Text
                  style={{ color: selected ? HOME_COLORS.teal : (isDark ? '#9CA3AF' : '#6B7280') }}
                  className={selected ? 'text-[13px] font-bold' : 'text-[13px] font-medium'}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Revelation */}
        <Text className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest mb-[10px]">
          Revelation type
        </Text>
        <View style={styles.optionsRow}>
          {REVELATION_OPTIONS.map(opt => {
            const selected = localState.revelation === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setLocalState(prev => ({ ...prev, revelation: opt.value }))}
                style={[
                  styles.optionBtn,
                  { borderColor: selected ? HOME_COLORS.teal : borderColor },
                  selected ? { backgroundColor: '#ECFAF9' } : undefined,
                ]}
                className={selected ? '' : 'bg-muted'}
              >
                <Text
                  style={{ color: selected ? HOME_COLORS.teal : (isDark ? '#9CA3AF' : '#6B7280') }}
                  className={selected ? 'text-[13px] font-bold' : 'text-[13px] font-medium'}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => setLocalState(DEFAULT_SORT_FILTER)}
            style={[styles.resetBtn, { borderColor }]}
          >
            <Text className="text-[15px] font-semibold text-muted-foreground">Reset</Text>
          </Pressable>
          <Pressable onPress={() => onApply(localState)} style={styles.applyBtn}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

function useLocalState(
  initial: SortFilterState,
  visible: boolean,
): [SortFilterState, React.Dispatch<React.SetStateAction<SortFilterState>>] {
  const [s, setS] = useState<SortFilterState>(initial);
  useEffect(() => {
    if (visible) setS(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return [s, setS];
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetLayout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontSize: 15, fontWeight: '700', color: 'white' },
});
