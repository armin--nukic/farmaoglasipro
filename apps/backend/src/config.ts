import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:5173"),
  PORT: z.coerce.number().default(4000),
  SOCKET_PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().default("postgres://farma:farma_password@localhost:5432/farma_oglasi"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change"),
  JWT_REFRESH_SECRET: z.string().min(16).default("dev-refresh-secret"),
  S3_ENDPOINT: z.string().url().default("http://localhost:9000"),
  S3_REGION: z.string().default("eu-central-1"),
  S3_BUCKET: z.string().default("farma-media"),
  S3_ACCESS_KEY: z.string().default("minioadmin"),
  S3_SECRET_KEY: z.string().default("minioadmin"),
  S3_PUBLIC_URL: z.string().url().default("http://localhost:9000/farma-media"),
  GOOGLE_CLIENT_ID: z.string().optional()
});

export const config = envSchema.parse(process.env);
export const isProduction = config.NODE_ENV === "production";
