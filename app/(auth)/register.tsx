import { AuthFooter } from '@/components/auth/auth-footer';
import { AuthHero } from '@/components/auth/auth-hero';
import { RegisterForm } from '@/components/auth/register-form';
import { useRegisterForm } from '@/hooks/use-register-form';
import { Text } from '@/components/ui/text';
import { Platform, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL_COLOR = '#12C4BE';

export default function RegisterScreen() {
  const formHook = useRegisterForm();

  return (
    // Outer View sets teal bg so the status-bar area matches the hero
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {/* Hero section — full-width, no horizontal padding */}
            <AuthHero />

            {/* Content section */}
            <View style={styles.content}>
              {/* Title */}
              <Text variant="h2" className="text-foreground font-bold">
                Register
              </Text>
              <Text variant="muted" className="leading-5">
                Start your day by reading the holy Quran verses.
              </Text>

              {/* Form */}
              <RegisterForm {...formHook} />

              {/* Footer */}
              <AuthFooter />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Bottom safe-area with white bg, matching the content section */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEAL_COLOR,
  },
  safeTop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    gap: 20,
  },
  safeBottom: {
    backgroundColor: 'white',
  },
});
