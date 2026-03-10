import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { useVerifyEmailForm } from '@/hooks/use-verify-email-form';
import { AuthSubmitButton } from './auth-submit-button';

const TEAL_COLOR = '#12C4BE';
const OTP_LENGTH = 6;

type VerifyEmailFormProps = ReturnType<typeof useVerifyEmailForm> & {
  email: string;
};

export function VerifyEmailForm({
  email,
  code,
  handleCodeChange,
  isLoading,
  isResending,
  error,
  countdown,
  canResend,
  handleSubmit,
  handleResend,
}: VerifyEmailFormProps) {
  const inputRef = useRef<TextInput>(null);

  // Split the code string into individual digit slots
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <View className="gap-6">
      {/* Subtitle with teal email highlight */}
      <Text variant="muted" className="leading-5">
        Enter the verification code sent to{' '}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      {/* OTP digit boxes */}
      <View className="gap-2">
        <Text className="text-sm font-semibold text-foreground">Verification code</Text>

        {/* Tappable row that focuses the hidden input */}
        <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxRow}>
          {digits.map((digit, i) => {
            const isFocused = i === code.length && i < OTP_LENGTH;
            return (
              <View
                key={i}
                style={[
                  styles.box,
                  digit ? styles.boxFilled : styles.boxEmpty,
                  isFocused && styles.boxFocused,
                ]}
              >
                <Text style={styles.boxText}>{digit}</Text>
              </View>
            );
          })}
        </Pressable>

        {/* Hidden TextInput captures all digit input */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          style={styles.hiddenInput}
          autoFocus
          caretHidden
          accessible={false}
          importantForAccessibility="no"
        />
      </View>

      {/* Resend row */}
      <View className="flex-row items-center justify-center gap-1">
        <Text variant="muted" className="text-sm">
          Didn't receive the code?{' '}
        </Text>
        {canResend ? (
          <Pressable
            onPress={handleResend}
            disabled={isResending}
            accessibilityRole="button"
            accessibilityLabel="Resend code"
          >
            <Text style={styles.resendActive} className="text-sm font-semibold">
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </Pressable>
        ) : (
          <Text variant="muted" className="text-sm">
            Resend{' '}
            <Text style={styles.countdown} className="text-sm font-semibold">
              ({countdown})
            </Text>
          </Text>
        )}
      </View>

      {/* Error */}
      {error ? (
        <Text variant="small" className="text-destructive text-center">
          {error}
        </Text>
      ) : null}

      {/* Continue */}
      <AuthSubmitButton
        label="Continue"
        onPress={handleSubmit}
        isLoading={isLoading}
        disabled={code.length < OTP_LENGTH}
      />

      {/* Cancel */}
      <Pressable
        onPress={() => router.back()}
        className="items-center py-2"
        accessibilityRole="button"
        accessibilityLabel="Cancel"
      >
        <Text className="text-foreground font-medium text-base">Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emailHighlight: {
    color: TEAL_COLOR,
    fontWeight: '500',
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxEmpty: {
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  boxFilled: {
    borderColor: TEAL_COLOR,
    backgroundColor: 'white',
  },
  boxFocused: {
    borderColor: TEAL_COLOR,
    borderWidth: 2,
  },
  boxText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendActive: {
    color: TEAL_COLOR,
  },
  countdown: {
    color: TEAL_COLOR,
  },
});
