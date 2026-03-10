import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

interface SocialIconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
}

export function SocialIconButton({ icon, onPress, accessibilityLabel }: SocialIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 items-center justify-center"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {icon}
    </Pressable>
  );
}
