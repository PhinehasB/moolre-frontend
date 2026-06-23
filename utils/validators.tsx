import { z } from "zod";

/** Matches backend @StrongPassword: 8–72 chars, letter, number, and symbol. */
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-zA-Z]/, "Must include at least one letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Must include at least one symbol");

const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number");

// ── Sign-in ───────────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  keepSigned: z.boolean().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;

// ── Sign-up step 1: Company ───────────────────────────────────────────────────

export const INDUSTRY_OPTIONS = [
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "RETAIL_AND_COMMERCE", label: "Retail & Commerce" },
  { value: "FINANCIAL_SERVICES", label: "Financial Services" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "HOSPITALITY", label: "Hospitality" },
  { value: "OTHER", label: "Other" },
] as const;

export const PAYROLL_BAND_OPTIONS = [
  { value: "UNDER_10K", label: "Under GHS 10,000" },
  { value: "FROM_10K_TO_50K", label: "GHS 10,000 – 50,000" },
  { value: "FROM_50K_TO_200K", label: "GHS 50,000 – 200,000" },
  { value: "OVER_200K", label: "Over GHS 200,000" },
] as const;

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  registrationNo: z
    .string()
    .min(1, "Registration number is required")
    .regex(
      /^[A-Z]{2}-\d{3,6}(-\d{3})?$/,
      "Use format CS-000-000 (e.g. CS-123-456)"
    ),
  industry: z.string().min(1, "Please select an industry"),
  payrollBand: z.string().min(1, "Please select an expected payroll range"),
});

export type CompanyValues = z.infer<typeof companySchema>;

// ── Sign-up step 2: Administrator ─────────────────────────────────────────────

export const adminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: phoneSchema,
  password: strongPasswordSchema,
});

export type AdminValues = z.infer<typeof adminSchema>;

// ── Forgot password ───────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// ── Reset password ────────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
