import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const collegesFilterSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["rating_desc", "rating_asc", "fees_asc", "fees_desc", "name_asc"])
    .optional()
    .default("rating_desc"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export const compareSchema = z.object({
  ids: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .pipe(
      z
        .array(z.string().cuid())
        .min(2, "Select at least 2 colleges")
        .max(3, "Maximum 3 colleges can be compared")
    ),
});

export const savedCollegeSchema = z.object({
  collegeId: z.string().cuid("Invalid college ID"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CollegesFilterInput = z.infer<typeof collegesFilterSchema>;
export type SavedCollegeInput = z.infer<typeof savedCollegeSchema>;
