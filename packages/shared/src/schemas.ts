import { z } from "zod";
import { animalCategories, currencies, listingTypes, userRoles } from "./constants.js";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().min(6).optional(),
  role: z.enum(userRoles).default("REGISTERED_USER")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(20)
});

export const listingSchema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(6000),
  price: z.coerce.number().nonnegative(),
  currency: z.enum(currencies),
  type: z.enum(listingTypes),
  category: z.string().min(2),
  animalCategory: z.enum(animalCategories).optional(),
  breed: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "MIXED", "UNKNOWN"]).optional(),
  ageMonths: z.coerce.number().int().nonnegative().optional(),
  weightKg: z.coerce.number().nonnegative().optional(),
  color: z.string().optional(),
  location: z.string().min(2),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  vaccinated: z.boolean().optional(),
  pedigree: z.boolean().optional(),
  healthStatus: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  viber: z.string().optional(),
  telegram: z.string().optional(),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false)
});

export const appointmentSchema = z.object({
  veterinarianId: z.string().uuid(),
  animalId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  reason: z.string().min(5),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("PENDING")
});
