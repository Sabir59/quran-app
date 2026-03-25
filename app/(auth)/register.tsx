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
    <View >
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Hero section — full-width, no horizontal padding */}
            <AuthHero />

            {/* Content section */}
            <View>
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
      <SafeAreaView />
    </View>
  );
}
