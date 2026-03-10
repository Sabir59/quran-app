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
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, state]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const [localState, setLocalState] = useLocalState(state, visible);

  function handleApply() {
    onApply(localState);
  }

  function handleReset() {
    setLocalState(DEFAULT_SORT_FILTER);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        <Text style={styles.sheetTitle}>Sort &amp; Filter</Text>

        {/* Sort */}
        <Text style={styles.sectionLabel}>Sort by</Text>
        <View style={styles.optionsRow}>
          {SORT_OPTIONS.map(opt => (
            <Pressable
              key={opt.value}
              onPress={() => setLocalState(prev => ({ ...prev, sort: opt.value }))}
              style={[styles.optionBtn, localState.sort === opt.value && styles.optionBtnSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  localState.sort === opt.value && styles.optionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Revelation filter */}
        <Text style={styles.sectionLabel}>Revelation type</Text>
        <View style={styles.optionsRow}>
          {REVELATION_OPTIONS.map(opt => (
            <Pressable
              key={opt.value}
              onPress={() => setLocalState(prev => ({ ...prev, revelation: opt.value }))}
              style={[
                styles.optionBtn,
                localState.revelation === opt.value && styles.optionBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  localState.revelation === opt.value && styles.optionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable onPress={handleApply} style={styles.applyBtn}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

/** Local state that resets to `initial` whenever `visible` becomes true */
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
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
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
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  optionBtnSelected: {
    borderColor: HOME_COLORS.teal,
    backgroundColor: '#ECFAF9',
  },
  optionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: HOME_COLORS.teal,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
});
