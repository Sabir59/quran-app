import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingRowProps {
  icon: IoniconName;
  /** Icon tint for non-destructive rows — defaults to muted-foreground gray */
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Right slot overrides the default value+chevron */
  right?: React.ReactNode;
  destructive?: boolean;
  isLast?: boolean;
}

export function SettingRow({
  icon,
  iconColor = '#6B7280',
  label,
  value,
  onPress,
  right,
  destructive = false,
  isLast = false,
}: SettingRowProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Icon color: use caller's color for normal rows; always red for destructive
  const resolvedIconColor = destructive
    ? (isDark ? '#F87171' : '#EF4444')
    : iconColor;

  const inner = (
    <View
      className={[
        'flex-row items-center px-4 py-[13px] gap-3',
        !isLast ? 'border-b border-border' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Icon pill */}
      <View
        className={[
          'w-[34px] h-[34px] rounded-[9px] items-center justify-center',
          destructive ? 'bg-destructive/10' : 'bg-muted',
        ].join(' ')}
      >
        <Ionicons name={icon} size={18} color={resolvedIconColor} />
      </View>

      {/* Label */}
      <Text
        className={[
          'flex-1 text-[15px] font-medium',
          destructive ? 'text-destructive' : 'text-foreground',
        ].join(' ')}
      >
        {label}
      </Text>

      {/* Right slot */}
      <View className="flex-row items-center gap-1">
        {right ?? (
          <>
            {value ? (
              <Text className="text-[13px] text-muted-foreground mr-1">{value}</Text>
            ) : null}
            {onPress ? (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={isDark ? '#4B5563' : '#D1D5DB'}
              />
            ) : null}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="button"
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
