import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth } from "../lib/auth.js";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get("/", asyncRoute(async (request, response) => {
  const result = await query(
    "SELECT *, read_at IS NOT NULL AS read FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
    [request.user!.id]
  );
  response.json({ data: result.rows });
}));

notificationsRouter.patch("/:id/read", asyncRoute(async (request, response) => {
  const result = await query(
    "UPDATE notifications SET read_at = now() WHERE id = $1 AND user_id = $2 RETURNING *",
    [request.params.id, request.user!.id]
  );
  response.json({ data: result.rows[0] ?? null });
}));
