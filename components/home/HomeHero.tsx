import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { HOME_COLORS } from '@/constants/home';

interface HomeHeroProps {
  userInitials?: string;
  onAvatarPress?: () => void;
}

export function HomeHero({ userInitials = 'AY', onAvatarPress }: HomeHeroProps) {
  return (
    <View style={styles.container}>
      {/* Decorative Quran image — right side, subtle */}
      <Image
        source={require('@/assets/images/bg-auth.png')}
        style={styles.bgDecor}
        resizeMode="contain"
      />

      {/* Top bar: logo left, avatar right */}
      <View style={styles.topBar}>
        <Image
          source={require('@/assets/images/logo-al-quran.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Alquran Persis.co.id"
        />

        <Pressable
          onPress={onAvatarPress}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel={`User avatar ${userInitials}`}
        >
          <Text style={styles.avatarText}>{userInitials}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bgDecor: {
    position: 'absolute',
    right: -16,
    top: -8,
    width: 170,
    height: 170,
    opacity: 0.18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 155,
    height: 46,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
