import { Router } from "express";
import bcrypt from "bcryptjs";
import { googleLoginSchema, loginSchema, registerSchema } from "@farma/shared";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { ApiError } from "../lib/errors.js";
import { signAccessToken, signRefreshToken } from "../lib/auth.js";
import { config } from "../config.js";

export const authRouter = Router();

authRouter.post("/register", asyncRoute(async (request, response) => {
  const payload = registerSchema.parse(request.body);
  const exists = await query("SELECT id FROM users WHERE email = $1", [payload.email]);
  if (exists.rowCount) throw new ApiError(409, "Email already registered");
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const result = await query<{ id: string; email: string; role: string; full_name: string }>(
    "INSERT INTO users (email, password_hash, full_name, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id,email,role,full_name",
    [payload.email, passwordHash, payload.fullName, payload.phone ?? null, "REGISTERED_USER"]
  );
  const user = result.rows[0]!;
  const tokenUser = { id: user.id, email: user.email, role: user.role };
  response.status(201).json({ data: { user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }, accessToken: signAccessToken(tokenUser), refreshToken: signRefreshToken(tokenUser) } });
}));

authRouter.post("/login", asyncRoute(async (request, response) => {
  const payload = loginSchema.parse(request.body);
  const result = await query<{ id: string; email: string; password_hash: string; role: string; full_name: string }>(
    "SELECT id,email,password_hash,role,full_name FROM users WHERE email = $1",
    [payload.email]
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(payload.password, user.password_hash))) throw new ApiError(401, "Invalid credentials");
  const tokenUser = { id: user.id, email: user.email, role: user.role };
  response.json({ data: { user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }, accessToken: signAccessToken(tokenUser), refreshToken: signRefreshToken(tokenUser) } });
}));

authRouter.post("/google", asyncRoute(async (request, response) => {
  const payload = googleLoginSchema.parse(request.body);
  const tokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(payload.idToken)}`);
  if (!tokenResponse.ok) throw new ApiError(401, "Invalid Google token");

  const googleUser = await tokenResponse.json() as {
    aud?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    picture?: string;
  };

  if (config.GOOGLE_CLIENT_ID && googleUser.aud !== config.GOOGLE_CLIENT_ID) {
    throw new ApiError(401, "Google token audience mismatch");
  }
  if (!googleUser.email || googleUser.email_verified !== "true") {
    throw new ApiError(401, "Google email is not verified");
  }

  const randomPasswordHash = await bcrypt.hash(`google:${googleUser.email}:${Date.now()}`, 12);
  const result = await query<{ id: string; email: string; role: string; full_name: string }>(
    `INSERT INTO users (email, password_hash, full_name, role, verified, avatar_url)
     VALUES ($1,$2,$3,'REGISTERED_USER',true,$4)
     ON CONFLICT (email) DO UPDATE SET avatar_url = coalesce(EXCLUDED.avatar_url, users.avatar_url), verified = true
     RETURNING id,email,role,full_name`,
    [googleUser.email, randomPasswordHash, googleUser.name ?? googleUser.email.split("@")[0], googleUser.picture ?? null]
  );

  const user = result.rows[0]!;
  const tokenUser = { id: user.id, email: user.email, role: user.role };
  response.json({ data: { user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }, accessToken: signAccessToken(tokenUser), refreshToken: signRefreshToken(tokenUser) } });
}));
