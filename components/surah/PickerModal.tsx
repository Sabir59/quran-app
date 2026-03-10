import { useCallback, useEffect, useRef, memo } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HOME_COLORS } from '@/constants/home';

export interface PickerItem {
  label: string;
  value: number;
  sublabel?: string;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selectedValue: number;
  onSelect: (value: number) => void;
  onDismiss: () => void;
}

const ITEM_HEIGHT = 54;

const PickerRow = memo(function PickerRow({
  item,
  selected,
  onPress,
}: {
  item: PickerItem;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <View style={styles.rowContent}>
        <Text
          style={[styles.rowLabel, selected && styles.rowLabelSelected]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
        {item.sublabel ? (
          <Text style={styles.rowSublabel}>{item.sublabel}</Text>
        ) : null}
      </View>
      {selected ? (
        <Ionicons name="checkmark" size={18} color={HOME_COLORS.teal} />
      ) : null}
    </Pressable>
  );
});

export function PickerModal({
  visible,
  title,
  items,
  selectedValue,
  onSelect,
  onDismiss,
}: PickerModalProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<PickerItem>>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 4,
      }).start();

      const index = items.findIndex(i => i.value === selectedValue);
      if (index > 2) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index,
            animated: false,
            viewPosition: 0.3,
          });
        }, 350);
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, items, selectedValue]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const renderItem = useCallback(
    ({ item }: { item: PickerItem }) => (
      <PickerRow
        item={item}
        selected={item.value === selectedValue}
        onPress={() => onSelect(item.value)}
      />
    ),
    [selectedValue, onSelect],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

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

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>

        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={item => String(item.value)}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          style={styles.list}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </Animated.View>
    </Modal>
  );
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
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  row: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  rowSelected: {
    backgroundColor: '#ECFAF9',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  rowLabelSelected: {
    color: HOME_COLORS.teal,
    fontWeight: '700',
  },
  rowSublabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
