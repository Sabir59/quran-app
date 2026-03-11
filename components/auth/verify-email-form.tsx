import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import type { useVerifyEmailForm } from '@/hooks/use-verify-email-form';

const TEAL_COLOR = '#12C4BE';
const OTP_LENGTH = 6;

type VerifyEmailFormProps = ReturnType<typeof useVerifyEmailForm> & { email: string };

export function VerifyEmailForm({
  email,
  form,
  serverError,
  isResending,
  countdown,
  canResend,
  isLoading,
  handleSubmit,
  handleResend,
}: VerifyEmailFormProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="gap-6">
      <Text variant="muted" className="leading-5">
        Enter the verification code sent to{' '}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      {/* OTP boxes driven by Controller */}
      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => {
          const digits = Array.from({ length: OTP_LENGTH }, (_, i) => field.value[i] ?? '');
          return (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Verification code</Text>

              <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxRow}>
                {digits.map((digit, i) => {
                  const isFocused = i === field.value.length && i < OTP_LENGTH;
                  return (
                    <View key={i} style={[styles.box, digit ? styles.boxFilled : styles.boxEmpty, isFocused && styles.boxFocused]}>
                      <Text style={styles.boxText}>{digit}</Text>
                    </View>
                  );
                })}
              </Pressable>

              <TextInput
                ref={inputRef}
                value={field.value}
                onChangeText={v => field.onChange(v.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                onBlur={field.onBlur}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                style={styles.hiddenInput}
                autoFocus
                caretHidden
                accessible={false}
                importantForAccessibility="no"
              />

              {fieldState.error ? (
                <Text variant="small" className="text-destructive">{fieldState.error.message}</Text>
              ) : null}
            </View>
          );
        }}
      />

      {/* Resend row */}
      <View className="flex-row items-center justify-center gap-1">
        <Text variant="muted" className="text-sm">{"Didn't receive the code? "}</Text>
        {canResend ? (
          <Pressable onPress={handleResend} disabled={isResending} accessibilityRole="button">
            <Text style={styles.resendActive} className="text-sm font-semibold">
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </Pressable>
        ) : (
          <Text variant="muted" className="text-sm">
            {'Resend '}
            <Text style={styles.countdown} className="text-sm font-semibold">({countdown})</Text>
          </Text>
        )}
      </View>

      {serverError ? (
        <Text variant="small" className="text-destructive text-center">{serverError}</Text>
      ) : null}

      <AuthSubmitButton
        label="Continue"
        onPress={handleSubmit}
        isLoading={isLoading}
        disabled={form.watch('code').length < OTP_LENGTH}
      />

      <Pressable onPress={() => router.back()} className="items-center py-2" accessibilityRole="button">
        <Text className="text-foreground font-medium text-base">Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emailHighlight: { color: TEAL_COLOR, fontWeight: '500' },
  boxRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: { flex: 1, height: 52, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  boxEmpty: { borderColor: '#E5E7EB', backgroundColor: 'white' },
  boxFilled: { borderColor: TEAL_COLOR, backgroundColor: 'white' },
  boxFocused: { borderColor: TEAL_COLOR, borderWidth: 2 },
  boxText: { fontSize: 20, fontWeight: '600', color: '#111827' },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  resendActive: { color: TEAL_COLOR },
  countdown: { color: TEAL_COLOR },
});
