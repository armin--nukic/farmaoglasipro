import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";

export const catalogRouter = Router();

catalogRouter.get("/animals", asyncRoute(async (_request, response) => {
  const result = await query("SELECT a.*, f.name AS farm_name FROM animals a LEFT JOIN farms f ON f.id = a.farm_id ORDER BY a.created_at DESC LIMIT 100");
  response.json({ data: result.rows });
}));

catalogRouter.get("/animals/:id/health", asyncRoute(async (request, response) => {
  const result = await query("SELECT * FROM animal_health_records WHERE animal_id = $1 ORDER BY recorded_at DESC", [request.params.id]);
  response.json({ data: result.rows });
}));

catalogRouter.get("/farms", asyncRoute(async (_request, response) => {
  const result = await query("SELECT f.*, u.full_name AS owner_name FROM farms f JOIN users u ON u.id = f.owner_id ORDER BY f.followers DESC LIMIT 100");
  response.json({ data: result.rows });
}));

catalogRouter.get("/veterinarians", asyncRoute(async (_request, response) => {
  const result = await query("SELECT v.*, u.full_name, u.phone, u.city FROM veterinarians v JOIN users u ON u.id = v.user_id ORDER BY v.rating DESC, v.experience_years DESC");
  response.json({ data: result.rows });
}));

catalogRouter.get("/veterinary-stations", asyncRoute(async (_request, response) => {
  const result = await query("SELECT * FROM veterinary_stations ORDER BY rating DESC, city ASC");
  response.json({ data: result.rows });
}));

catalogRouter.get("/auctions", asyncRoute(async (_request, response) => {
  const result = await query("SELECT a.*, l.title, l.image_urls FROM auctions a JOIN listings l ON l.id = a.listing_id ORDER BY a.ends_at ASC");
  response.json({ data: result.rows });
}));
