import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';

interface FormInputProps extends TextInputProps {
  /** Floating label rendered on the top-left border edge (e.g. "E-Mail"). */
  label?: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  error?: string;
  containerClassName?: string;
}

export function FormInput({
  label,
  rightIcon,
  onRightIconPress,
  error,
  containerClassName,
  className,
  ...props
}: FormInputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={cn(containerClassName)}
      style={label ? styles.labeledWrapper : undefined}
    >
      {label ? (
        <View style={[styles.labelContainer, { backgroundColor: isDark ? '#0a0a0f' : 'white' }]}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ) : null}

      <View
        className={cn(
          'flex-row items-center h-14 rounded-lg border border-border bg-background overflow-hidden',
          error && 'border-destructive',
        )}
      >
        <TextInput
          className={cn('flex-1 h-full px-4 text-sm text-foreground', className)}
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          {...props}
        />
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            className="h-full w-12 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
          >
            {rightIcon}
          </Pressable>
        )}
      </View>

      {error ? (
        <Text variant="small" className="text-destructive px-1 pt-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labeledWrapper: { marginTop: 8 },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  labelText: { fontSize: 11, color: '#9CA3AF', lineHeight: 16 },
});
