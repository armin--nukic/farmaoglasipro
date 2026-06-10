import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { config, isProduction } from "./config.js";
import { adminRouter } from "./routes/admin.js";
import { aiRouter } from "./routes/ai.js";
import { appointmentsRouter } from "./routes/appointments.js";
import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { listingsRouter } from "./routes/listings.js";
import { errorHandler, notFound } from "./lib/errors.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: config.APP_URL, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "5mb" }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: isProduction ? 600 : 5000 }));
  app.use(morgan(isProduction ? "combined" : "dev"));

  app.get("/health", (_request, response) => response.json({ status: "ok", service: "farma-backend", time: new Date().toISOString() }));
  app.use("/api/auth", authRouter);
  app.use("/api/listings", listingsRouter);
  app.use("/api", catalogRouter);
  app.use("/api/appointments", appointmentsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/ai", aiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
