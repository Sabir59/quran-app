import { AntDesign, Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SocialIconButton } from './social-icon-button';

const TEAL_COLOR = '#12C4BE';
const ICON_COLOR = '#9CA3AF';
const ICON_SIZE = 22;

const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', icon: <AntDesign name="linkedin-square" size={ICON_SIZE} color={ICON_COLOR} /> },
  { key: 'facebook', label: 'Facebook', icon: <Feather name="facebook" size={ICON_SIZE} color={ICON_COLOR} /> },
  { key: 'instagram', label: 'Instagram', icon: <Feather name="instagram" size={ICON_SIZE} color={ICON_COLOR} /> },
  { key: 'x', label: 'X', icon: <AntDesign name="twitter" size={ICON_SIZE} color={ICON_COLOR} /> },
] as const;

export function AuthFooter() {
  return (
    <View className="items-center gap-3">
      <Text variant="small" style={{ color: TEAL_COLOR }} className="text-center">
        © 2023 Persis Software Labs, All Rights Reserved.
      </Text>
      <View className="flex-row items-center justify-center gap-2">
        {SOCIAL_LINKS.map(({ key, label, icon }) => (
          <SocialIconButton key={key} icon={icon} accessibilityLabel={label} />
        ))}
      </View>
    </View>
  );
}
