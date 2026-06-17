import { Router } from "express";
import { z } from "zod";
import { listingTypes } from "@farma/shared";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth, requireRole } from "../lib/auth.js";

export const categoriesRouter = Router();

const categorySchema = z.object({
  type: z.enum(listingTypes),
  name: z.string().min(2).max(80)
});

function slugify(type: string, name: string) {
  return `${type}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

categoriesRouter.get("/", asyncRoute(async (request, response) => {
  const type = request.query.type ? z.enum(listingTypes).parse(request.query.type) : null;
  const result = await query(
    `SELECT * FROM marketplace_categories ${type ? "WHERE type = $1" : ""} ORDER BY type, name`,
    type ? [type] : []
  );
  response.json({ data: result.rows });
}));

categoriesRouter.post("/", requireAuth, requireRole("ADMINISTRATOR", "SUPER_ADMIN", "MODERATOR"), asyncRoute(async (request, response) => {
  const payload = categorySchema.parse(request.body);
  const result = await query(
    `INSERT INTO marketplace_categories (type, name, slug, created_by)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING *`,
    [payload.type, payload.name, slugify(payload.type, payload.name), request.user!.id]
  );
  response.status(201).json({ data: result.rows[0] });
}));
