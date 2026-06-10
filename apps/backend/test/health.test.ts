import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("health", () => {
  it("returns service status", async () => {
    const response = await request(createApp()).get("/health").expect(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("farma-backend");
  });
});
