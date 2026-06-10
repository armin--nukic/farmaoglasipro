import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { listingSchema, userRoles } from "@farma/shared";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth, requireRole } from "../lib/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("ADMINISTRATOR", "SUPER_ADMIN", "MODERATOR"));

const adminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).default("Password123!"),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(userRoles),
  verified: z.boolean().default(true),
  city: z.string().optional()
});

const farmSchema = z.object({
  ownerId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().min(10),
  city: z.string().min(2),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional()
});

const animalSchema = z.object({
  ownerId: z.string().uuid(),
  farmId: z.string().uuid().optional(),
  name: z.string().optional(),
  animalId: z.string().min(3),
  microchipNumber: z.string().optional(),
  category: z.string().min(2),
  breed: z.string().min(2),
  birthDate: z.string().optional(),
  weightKg: z.coerce.number().optional(),
  healthStatus: z.string().default("Healthy")
});

const stationSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  services: z.array(z.string()).default([]),
  openingHours: z.string().default("08:00-18:00"),
  emergencyContact: z.string().min(6),
  rating: z.coerce.number().min(0).max(5).default(4.5)
});

const premiumSchema = z.object({
  userId: z.string().uuid(),
  months: z.coerce.number().int().min(1).max(24).default(1),
  provider: z.string().default("MANUAL_ADMIN"),
  paid: z.boolean().default(true)
});

adminRouter.get("/dashboard", asyncRoute(async (_request, response) => {
  const [users, listings, animals, revenue, reports] = await Promise.all([
    query("SELECT role, count(*)::int FROM users GROUP BY role"),
    query("SELECT type, count(*)::int, avg(price)::numeric(12,2) AS average_price FROM listings GROUP BY type"),
    query("SELECT category, count(*)::int FROM animals GROUP BY category"),
    query("SELECT coalesce(sum(amount),0)::numeric(12,2) AS total FROM payments WHERE status = 'PAID'"),
    query("SELECT status, count(*)::int FROM reports GROUP BY status")
  ]);
  response.json({ data: { users: users.rows, listings: listings.rows, animals: animals.rows, revenue: revenue.rows[0], reports: reports.rows } });
}));

adminRouter.get("/logs", asyncRoute(async (_request, response) => {
  const result = await query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100");
  response.json({ data: result.rows });
}));

adminRouter.get("/users", asyncRoute(async (_request, response) => {
  const result = await query("SELECT id,email,full_name,phone,role,verified,city,created_at FROM users ORDER BY created_at DESC LIMIT 200");
  response.json({ data: result.rows });
}));

adminRouter.post("/users", asyncRoute(async (request, response) => {
  const payload = adminUserSchema.parse(request.body);
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, phone, role, verified, city)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id,email,full_name,phone,role,verified,city,created_at`,
    [payload.email, passwordHash, payload.fullName, payload.phone ?? null, payload.role, payload.verified, payload.city ?? null]
  );
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','users',$2,$3)", [request.user!.id, result.rows[0]!.id, { email: payload.email, role: payload.role }]);
  response.status(201).json({ data: result.rows[0] });
}));

adminRouter.post("/farms", asyncRoute(async (request, response) => {
  const payload = farmSchema.parse(request.body);
  const result = await query(
    `INSERT INTO farms (owner_id, name, description, city, latitude, longitude)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [payload.ownerId, payload.name, payload.description, payload.city, payload.latitude ?? null, payload.longitude ?? null]
  );
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','farms',$2,$3)", [request.user!.id, result.rows[0]!.id, { name: payload.name }]);
  response.status(201).json({ data: result.rows[0] });
}));

adminRouter.post("/animals", asyncRoute(async (request, response) => {
  const payload = animalSchema.parse(request.body);
  const result = await query(
    `INSERT INTO animals (owner_id, farm_id, name, animal_id, microchip_number, category, breed, birth_date, weight_kg, health_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [payload.ownerId, payload.farmId ?? null, payload.name ?? null, payload.animalId, payload.microchipNumber ?? null, payload.category, payload.breed, payload.birthDate ?? null, payload.weightKg ?? null, payload.healthStatus]
  );
  await query("INSERT INTO animal_health_records (animal_id, record_type, title, notes) VALUES ($1,'PROFILE','Animal profile created','Created by admin panel')", [result.rows[0]!.id]);
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','animals',$2,$3)", [request.user!.id, result.rows[0]!.id, { animalId: payload.animalId }]);
  response.status(201).json({ data: result.rows[0] });
}));

adminRouter.post("/veterinary-stations", asyncRoute(async (request, response) => {
  const payload = stationSchema.parse(request.body);
  const result = await query(
    `INSERT INTO veterinary_stations (name, city, address, latitude, longitude, services, opening_hours, emergency_contact, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [payload.name, payload.city, payload.address, payload.latitude, payload.longitude, payload.services, payload.openingHours, payload.emergencyContact, payload.rating]
  );
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','veterinary_stations',$2,$3)", [request.user!.id, result.rows[0]!.id, { name: payload.name }]);
  response.status(201).json({ data: result.rows[0] });
}));

adminRouter.post("/listings", asyncRoute(async (request, response) => {
  const payload = listingSchema.parse(request.body);
  const ownerId = z.string().uuid().parse(request.body.ownerId);
  const slug = `${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
  const result = await query(
    `INSERT INTO listings (owner_id,title,slug,description,price,currency,type,category,breed,gender,age_months,weight_kg,color,location,latitude,longitude,vaccinated,pedigree,health_status,phone,whatsapp,viber,telegram,featured,urgent,expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,now() + interval '60 days') RETURNING *`,
    [ownerId, payload.title, slug, payload.description, payload.price, payload.currency, payload.type, payload.category, payload.breed, payload.gender, payload.ageMonths, payload.weightKg, payload.color, payload.location, payload.latitude, payload.longitude, payload.vaccinated ?? false, payload.pedigree ?? false, payload.healthStatus, payload.phone, payload.whatsapp, payload.viber, payload.telegram, payload.featured, payload.urgent]
  );
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','listings',$2,$3)", [request.user!.id, result.rows[0]!.id, { title: payload.title, type: payload.type }]);
  response.status(201).json({ data: result.rows[0] });
}));

adminRouter.post("/premium", asyncRoute(async (request, response) => {
  const payload = premiumSchema.parse(request.body);
  const amount = payload.months * 10;
  const [subscription, payment] = await Promise.all([
    query(
      `INSERT INTO subscriptions (user_id, plan, status, current_period_end)
       VALUES ($1,'PREMIUM_FULL','ACTIVE', now() + ($2 || ' months')::interval) RETURNING *`,
      [payload.userId, payload.months]
    ),
    query(
      `INSERT INTO payments (user_id, provider, amount, currency, status)
       VALUES ($1,$2,$3,'BAM',$4) RETURNING *`,
      [payload.userId, payload.provider, amount, payload.paid ? "PAID" : "PENDING"]
    ),
    query("UPDATE users SET role = 'PREMIUM_USER', verified = true WHERE id = $1", [payload.userId])
  ]);
  await query(
    `INSERT INTO notifications (user_id, title, body, channel)
     VALUES ($1,'Premium aktiviran','Aktiviran je Premium Full paket: 10 KM mjesecno, izdvojeni oglasi i veca vidljivost.','REALTIME')`,
    [payload.userId]
  );
  await query("INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES ($1,'CREATE','premium',$2,$3)", [request.user!.id, payload.userId, { amount, months: payload.months }]);
  response.status(201).json({ data: { subscription: subscription.rows[0], payment: payment.rows[0], amount } });
}));
