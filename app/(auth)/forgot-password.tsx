import { AuthFooter } from '@/components/ui-lib/auth/auth-footer';
import { AuthHero } from '@/components/ui-lib/auth/auth-hero';
import { ForgotPasswordForm } from '@/components/ui-lib/auth/forgot-password-form';
import { useForgotPasswordForm } from '@/hooks/use-forgot-password-form';
import { Text } from '@/components/ui/text';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL_COLOR = '#12C4BE';

export default function ForgotPasswordScreen() {
  const form = useForgotPasswordForm();

  return (
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
            <AuthHero />

            <View style={styles.content}>
              <Text variant="h2" className="text-foreground font-bold">
                Forgot Password
              </Text>
              <Text variant="muted" className="leading-5">
                Enter your email address and we'll send you a verification code to reset your password.
              </Text>

              <ForgotPasswordForm {...form} />

              <AuthFooter />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

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
