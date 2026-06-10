import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { ApiError } from "./errors.js";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signAccessToken(user: AuthUser) {
  return jwt.sign(user, config.JWT_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(user: AuthUser) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Missing access token");
  try {
    request.user = jwt.verify(header.slice(7), config.JWT_SECRET) as AuthUser;
    next();
  } catch {
    throw new ApiError(401, "Invalid access token");
  }
}

export function requireRole(...roles: string[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) throw new ApiError(401, "Authentication required");
    if (!roles.includes(request.user.role)) throw new ApiError(403, "Insufficient permissions");
    next();
  };
}
