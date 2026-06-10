import type { animalCategories, currencies, listingTypes, userRoles } from "./constants.js";

export type Currency = (typeof currencies)[number];
export type UserRole = (typeof userRoles)[number];
export type AnimalCategory = (typeof animalCategories)[number];
export type ListingType = (typeof listingTypes)[number];

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  verified: boolean;
  city?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  type: ListingType;
  category: string;
  breed?: string;
  gender?: "MALE" | "FEMALE" | "MIXED" | "UNKNOWN";
  ageMonths?: number;
  weightKg?: number;
  color?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  vaccinated?: boolean;
  pedigree?: boolean;
  healthStatus?: string;
  imageUrls: string[];
  videoUrls: string[];
  owner: Pick<User, "id" | "fullName" | "phone" | "verified" | "role">;
  phone?: string;
  whatsapp?: string;
  viber?: string;
  telegram?: string;
  views: number;
  favorites: number;
  featured: boolean;
  urgent: boolean;
  publishedAt: string;
  expiresAt: string;
}

export interface AnimalProfile {
  id: string;
  name: string;
  animalId: string;
  microchipNumber?: string;
  breed: string;
  birthDate?: string;
  qrCodeUrl?: string;
  weightHistory: Array<{ date: string; weightKg: number }>;
  vaccinationHistory: Array<{ date: string; vaccine: string; veterinarian: string }>;
  medicalHistory: Array<{ date: string; diagnosis: string; treatment: string }>;
}

export interface Veterinarian {
  id: string;
  fullName: string;
  specializations: string[];
  licenseNumber: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  city: string;
  emergencyAvailable: boolean;
  onlineConsultation: boolean;
}

export interface VeterinaryStation {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string[];
  rating: number;
  openingHours: string;
  emergencyContact: string;
}

export interface Appointment {
  id: string;
  veterinarianId: string;
  animalId: string;
  userId: string;
  scheduledAt: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}
