import { AntDesign, Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { HOME_COLORS, SOCIAL_LINKS } from '@/constants/home';

const SOCIAL_ITEMS = [
  {
    key: 'linkedin',
    icon: <AntDesign name="linkedin-square" size={22} color="rgba(255,255,255,0.85)" />,
    label: 'LinkedIn',
    url: SOCIAL_LINKS.linkedin,
  },
  {
    key: 'facebook',
    icon: <Feather name="facebook" size={22} color="rgba(255,255,255,0.85)" />,
    label: 'Facebook',
    url: SOCIAL_LINKS.facebook,
  },
  {
    key: 'instagram',
    icon: <Feather name="instagram" size={22} color="rgba(255,255,255,0.85)" />,
    label: 'Instagram',
    url: SOCIAL_LINKS.instagram,
  },
  {
    key: 'x',
    icon: <AntDesign name="twitter" size={22} color="rgba(255,255,255,0.85)" />,
    label: 'X',
    url: SOCIAL_LINKS.x,
  },
] as const;

export function HomeFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.copyright}>
        © 2023 Persis Software Labs, All Rights Reserved.
      </Text>
      <View style={styles.socialRow}>
        {SOCIAL_ITEMS.map(item => (
          <Pressable
            key={item.key}
            onPress={() => Linking.openURL(item.url).catch(() => {})}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {item.icon}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HOME_COLORS.teal,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 12,
  },
  copyright: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.65,
  },
});
