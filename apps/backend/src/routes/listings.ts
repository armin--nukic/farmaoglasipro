import { Router } from "express";
import { listingSchema } from "@farma/shared";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth } from "../lib/auth.js";
import { cached, invalidate } from "../lib/cache.js";

export const listingsRouter = Router();

const listingSelect = `
  SELECT l.*, json_build_object('id', u.id, 'fullName', u.full_name, 'phone', u.phone, 'verified', u.verified, 'role', u.role) AS owner
  FROM listings l
  JOIN users u ON u.id = l.owner_id
`;

listingsRouter.get("/", asyncRoute(async (request, response) => {
  const { type, category, q, city, featured } = request.query;
  const key = `listings:${JSON.stringify(request.query)}`;
  const data = await cached(key, 60, async () => {
    const filters: string[] = [];
    const values: unknown[] = [];
    if (type) {
      values.push(type);
      filters.push(`l.type = $${values.length}`);
    }
    if (category) {
      values.push(category);
      filters.push(`l.category = $${values.length}`);
    }
    if (city) {
      values.push(city);
      filters.push(`l.location ILIKE '%' || $${values.length} || '%'`);
    }
    if (q) {
      values.push(q);
      filters.push(`(l.title ILIKE '%' || $${values.length} || '%' OR l.description ILIKE '%' || $${values.length} || '%')`);
    }
    if (featured === "true") filters.push("l.featured = true");
    const sql = `${listingSelect} ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""} ORDER BY l.featured DESC, l.urgent DESC, l.published_at DESC LIMIT 80`;
    const result = await query(sql, values);
    return result.rows;
  });
  response.json({ data });
}));

listingsRouter.get("/:slug", asyncRoute(async (request, response) => {
  const result = await query(`${listingSelect} WHERE l.slug = $1`, [request.params.slug]);
  if (!result.rowCount) return response.status(404).json({ error: "Listing not found" });
  await query("UPDATE listings SET views = views + 1 WHERE slug = $1", [request.params.slug]);
  response.json({ data: result.rows[0] });
}));

listingsRouter.post("/", requireAuth, asyncRoute(async (request, response) => {
  const payload = listingSchema.parse(request.body);
  const slug = `${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
  const result = await query(
    `INSERT INTO listings (owner_id,title,slug,description,price,currency,type,category,breed,gender,age_months,weight_kg,color,location,latitude,longitude,vaccinated,pedigree,health_status,phone,whatsapp,viber,telegram,featured,urgent,expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,now() + interval '60 days') RETURNING *`,
    [request.user!.id, payload.title, slug, payload.description, payload.price, payload.currency, payload.type, payload.category, payload.breed, payload.gender, payload.ageMonths, payload.weightKg, payload.color, payload.location, payload.latitude, payload.longitude, payload.vaccinated ?? false, payload.pedigree ?? false, payload.healthStatus, payload.phone, payload.whatsapp, payload.viber, payload.telegram, payload.featured, payload.urgent]
  );
  await invalidate("listings:*");
  response.status(201).json({ data: result.rows[0] });
}));

listingsRouter.patch("/:id/renew", requireAuth, asyncRoute(async (request, response) => {
  const result = await query("UPDATE listings SET expires_at = now() + interval '60 days', published_at = now() WHERE id = $1 AND owner_id = $2 RETURNING *", [request.params.id, request.user!.id]);
  await invalidate("listings:*");
  response.json({ data: result.rows[0] });
}));
