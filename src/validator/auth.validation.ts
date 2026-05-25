import { z } from "zod";

export const createTenantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Company name must be at least 3 characters")
      .max(100, "Company name too long"),
    domain: z
      .string()
      .min(3, "Domain must be at least 3 characters")
      .max(50)
      .regex(
        /^[a-z0-9-]+$/,
        "Domain must be lowercase alphanumeric with hyphens",
      ),
    plan: z.enum(["FREE", "PRO", "ENTERPRISE"]).optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100),
    email: z.string().email("Invalid email").toLowerCase(),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"]),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(20, "Reset token is required."),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100)
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[@$!%*?&]/, "Must contain at least one special character"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const adminOktaLoginSchema = z.object({
  body: z.object({
    token: z.string().min(20, "Okta token is required."),
  }),
});
