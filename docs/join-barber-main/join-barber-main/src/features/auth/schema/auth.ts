import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(2, {
    message: "Min 2 characters",
  }).max(50, {
    message: "Max 50 characters",
  }),
  lastName: z.string().min(2, {
    message: "Min 2 characters",
  }).max(50, {
    message: "Max 50 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required",
  }).refine((val) => {
    // Basic phone validation - at least 10 digits including country code
    const digitsOnly = val.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }, {
    message: "Please enter a valid phone number",
  }),
  accountType: z.string().refine((val) => ["Customer", "Shop", "Admin", "Barber"].includes(val), {
    message: "Please select an account type.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
