import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export function notFound(_request: Request, _response: Response, next: NextFunction) {
  next(new ApiError(404, "Resource not found"));
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return response.status(422).json({ error: "Validation failed", details: error.flatten() });
  }

  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({ error: error.message, details: error.details });
  }

  console.error(error);
  return response.status(500).json({ error: "Internal server error" });
}
