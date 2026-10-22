import { z } from "zod";

export const propertyTypes = ["Villa", "Estate", "Penthouse", "Apartment", "Bungalow"];

function requiredNumber(label, { integer = false, allowZero = false, max = 1_000_000_000_000 } = {}) {
  return z.union([z.string(), z.number()]).transform((value, ctx) => {
    if (value === "" || value === null || value === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} is required` });
      return z.NEVER;
    }

    const number = typeof value === "number" ? value : Number(String(value).trim());
    if (!Number.isFinite(number)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} must be a number` });
      return z.NEVER;
    }

    if (integer && !Number.isInteger(number)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} must be a whole number` });
      return z.NEVER;
    }

    if (allowZero ? number < 0 : number <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: allowZero ? `${label} cannot be negative` : `${label} must be a positive number`,
      });
      return z.NEVER;
    }

    if (number > max) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${label} is too large` });
      return z.NEVER;
    }

    return number;
  });
}

function requiredText(label, min, max) {
  return z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(min, min === 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`);
}

export const propertySchema = z.object({
  name: requiredText("Name", 2, 120),
  location: requiredText("Location", 2, 80),
  address: requiredText("Address", 5, 200),
  price: requiredNumber("Price"),
  sizeSqft: requiredNumber("Size", { integer: true, max: 1_000_000 }),
  bedrooms: requiredNumber("Bedrooms", { integer: true, allowZero: true, max: 50 }),
  bathrooms: requiredNumber("Bathrooms", { integer: true, allowZero: true, max: 50 }),
  propertyType: z.enum(propertyTypes, {
    errorMap: () => ({ message: "Choose a property type" }),
  }),
  description: requiredText("Short description", 10, 400),
  details: requiredText("Full description", 20, 5000),
  imageUrl: z
    .string({ required_error: "Primary image is required" })
    .trim()
    .min(1, "Primary image is required")
    .url("Primary image must be a valid URL")
    .max(2000),
  images: z
    .array(z.string().max(2000))
    .max(6, "Add no more than 6 additional images")
    .optional()
    .default([])
    .superRefine((urls, ctx) => {
      const invalid = urls.some((url) => !z.string().trim().url().safeParse(url).success);
      if (invalid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each additional image must be a valid URL",
        });
      }
    }),
  featured: z.boolean().optional().default(false),
});

export const inquirySchema = z.object({
  propertyId: z.string().trim().min(1, "A residence is required"),
  name: requiredText("Name", 2, 120),
  email: z.string().trim().email("Enter a valid email").max(200).transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+().\-\s]+$/, "Use digits and standard phone symbols"),
  message: requiredText("Message", 10, 2000),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export const listQuerySchema = z.object({
  location: z.string().trim().min(1).max(80).optional(),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "size_desc", "bedrooms_desc"])
    .optional()
    .default("newest"),
});
