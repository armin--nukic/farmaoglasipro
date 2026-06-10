import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("ai helpers", () => {
  it("generates listing copy", async () => {
    const response = await request(createApp())
      .post("/api/ai/listing-description")
      .send({ title: "Simental junica", category: "CATTLE", breed: "Simental", location: "Travnik" })
      .expect(200);

    expect(response.body.data.description).toContain("Simental");
    expect(response.body.data.fraudRisk).toBe("LOW");
  });
});
