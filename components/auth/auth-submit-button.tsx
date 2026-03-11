import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
const TEAL_COLOR = '#12C4BE';
interface AuthSubmitButtonProps { label: string; onPress: () => void; isLoading?: boolean; disabled?: boolean; }
export function AuthSubmitButton({ label, onPress, isLoading = false, disabled = false }: AuthSubmitButtonProps) {
  const isDisabled = disabled || isLoading;
  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={[styles.button, isDisabled && styles.buttonDisabled]} accessibilityRole='button' accessibilityLabel={label} accessibilityState={{ disabled: isDisabled, busy: isLoading }}>
      {isLoading ? <ActivityIndicator color='#ffffff' /> : <Text className='text-white font-semibold text-base'>{label}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({ button: { backgroundColor: TEAL_COLOR, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' }, buttonDisabled: { opacity: 0.65 } });
