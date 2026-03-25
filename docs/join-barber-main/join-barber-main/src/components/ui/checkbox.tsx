import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<View, CheckboxProps>(({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
  labelClassName,
}, ref) => {
  const { colorScheme } = useColorScheme();

  return (
    <View ref={ref} className={cn('flex-row items-center gap-3', className)}>
      <TouchableOpacity
        onPress={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        className={cn(
          'w-5 h-5 border-2 rounded items-center justify-center',
          checked ? 'bg-primary border-primary' : 'bg-background border-input',
          disabled && 'opacity-50'
        )}
      >
        {checked && (
          <Check size={12} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
        )}
      </TouchableOpacity>
      
      {label && (
        <Text className={cn('text-foreground', labelClassName)}>
          {label}
        </Text>
      )}
    </View>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };