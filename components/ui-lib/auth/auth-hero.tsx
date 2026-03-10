import { Image, StyleSheet, View } from 'react-native';

// The bg-auth.png already contains the Quran book image with the teal ellipse.
// We add a solid teal background behind it in case of letterboxing, and overlay the logo.
const TEAL_COLOR = '#12C4BE';

export function AuthHero() {
  return (
    <View
      style={styles.container}
    >
      {/* Solid teal fallback behind the image */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: TEAL_COLOR }]} />

      {/* Hero background — Quran book image with circular teal shape */}
      <Image
        source={require('@/assets/images/bg-auth.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Logo overlay — centered in the hero */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('@/assets/images/logo-al-quran.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Alquran Persis.co.id"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 210,
    height: 64,
  },
});
