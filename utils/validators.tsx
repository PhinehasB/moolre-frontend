import { z } from "zod";

// Sign-in
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
  keepSigned: z.boolean().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;

// Sign-up step 1: Company
export const companySchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters"),
  registrationNo: z
    .string()
    .min(1, "Registration number is required")
    .regex(
      /^[A-Z]{2}-\d{3,6}(-\d{3})?$/,
      "Use format CS-000-000 (e.g. CS-123-456)"
    ),
  industry: z
    .string()
    .min(1, "Please select an industry"),
});

export type CompanyValues = z.infer<typeof companySchema>;

// Sign-up step 2: Administrator
export const adminSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must include at least one letter")
    .regex(/[0-9]/, "Must include at least one number"),
});

export type AdminValues = z.infer<typeof adminSchema>;
