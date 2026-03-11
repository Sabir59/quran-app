import { Image, StyleSheet, View } from 'react-native';
const TEAL_COLOR = '#12C4BE';
export function AuthHero() {
  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: TEAL_COLOR }]} />
      <Image source={require('@/assets/images/bg-auth.png')} style={styles.backgroundImage} resizeMode='cover' />
      <View style={styles.logoWrapper}>
        <Image source={require('@/assets/images/logo-al-quran.png')} style={styles.logo} resizeMode='contain' accessibilityLabel='Alquran Persis.co.id' />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { width: '100%', height: 240, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, overflow: 'hidden' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  logoWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 210, height: 64 },
});
