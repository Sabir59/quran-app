/**
 * auth.schemas.ts — Zod validation schemas for all auth forms
 *
 * Single source of truth for validation rules.
 * Inferred TypeScript types are exported alongside each schema so
 * form hooks and components never manually define field types.
 *
 * RULE: Every form in the app must have its schema here (or in a
 * feature-specific schemas file). No inline validation logic in hooks
 * or components.
 */

import { z } from 'zod';

// ─── Reusable field rules ─────────────────────────────────────────────────────
// Note: Zod v4 dropped `required_error` — use .min(1, msg) for empty checks.

const emailField = z
  .string()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.');

const passwordField = z
  .string()
  .min(1, 'Password is required.')
  .min(8, 'Password must be at least 8 characters.');

const otpField = z
  .string()
  .min(1, 'Verification code is required.')
  .length(6, 'Enter the full 6-digit code.');

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required.')
      .min(2, 'Name must be at least 2 characters.')
      .max(50, 'Name must be at most 50 characters.'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export const verifyOtpSchema = z.object({
  code: otpField,
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
