import { Router } from "express";
import { appointmentSchema } from "@farma/shared";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth } from "../lib/auth.js";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", requireAuth, asyncRoute(async (request, response) => {
  const result = await query("SELECT * FROM appointments WHERE user_id = $1 ORDER BY scheduled_at DESC", [request.user!.id]);
  response.json({ data: result.rows });
}));

appointmentsRouter.post("/", requireAuth, asyncRoute(async (request, response) => {
  const payload = appointmentSchema.parse(request.body);
  const result = await query(
    "INSERT INTO appointments (user_id, veterinarian_id, animal_id, scheduled_at, reason, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [request.user!.id, payload.veterinarianId, payload.animalId, payload.scheduledAt, payload.reason, payload.status]
  );
  response.status(201).json({ data: result.rows[0] });
}));
