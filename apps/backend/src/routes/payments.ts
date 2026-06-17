import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth } from "../lib/auth.js";

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);

paymentsRouter.post("/premium/checkout", asyncRoute(async (request, response) => {
  const payload = z.object({
    provider: z.enum(["MONRI", "PAYPAL", "STRIPE", "MANUAL_TEST"]).default("MONRI"),
    months: z.coerce.number().int().min(1).max(24).default(1)
  }).parse(request.body);
  const amount = payload.months * 5;
  const payment = await query(
    `INSERT INTO payments (user_id, provider, amount, currency, status, invoice_url)
     VALUES ($1,$2,$3,'BAM','PENDING',$4)
     RETURNING *`,
    [request.user!.id, payload.provider, amount, `https://monri.example/checkout/farma-${Date.now()}`]
  );
  response.status(201).json({
    data: {
      payment: payment.rows[0],
      checkoutUrl: payment.rows[0]!.invoice_url,
      testMode: true,
      message: "Monri test checkout kreiran. U produkciji ovdje ide Monri form/token redirect."
    }
  });
}));

paymentsRouter.post("/premium/trial", asyncRoute(async (request, response) => {
  const result = await query(
    `INSERT INTO subscriptions (user_id, plan, status, current_period_end)
     VALUES ($1,'FREE_TRIAL','ACTIVE', now() + interval '14 days')
     RETURNING *`,
    [request.user!.id]
  );
  await query("INSERT INTO notifications (user_id, title, body, channel) VALUES ($1,'Free trial aktiviran','Aktiviran je 14 dana Full Access trial paket.','REALTIME')", [request.user!.id]);
  response.status(201).json({ data: result.rows[0] });
}));
