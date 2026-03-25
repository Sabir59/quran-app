import { z } from 'zod';

export const createSubUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  relation: z.string().min(1, 'Please select a relation'),
  isActive: z.boolean(),
});

export type CreateSubUserFormData = z.infer<typeof createSubUserSchema>;
