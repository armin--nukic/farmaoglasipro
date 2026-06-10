import { Router } from "express";
import { asyncRoute } from "../lib/async-route.js";

export const aiRouter = Router();

aiRouter.post("/listing-description", asyncRoute(async (request, response) => {
  const { title, category, breed, location, facts = [] } = request.body as { title?: string; category?: string; breed?: string; location?: string; facts?: string[] };
  const description = [
    `${title ?? "Oglas"} je pazljivo pripremljena ponuda u kategoriji ${category ?? "farma"}.`,
    breed ? `Rasa: ${breed}.` : undefined,
    location ? `Lokacija: ${location}.` : undefined,
    facts.length ? `Istaknute informacije: ${facts.join(", ")}.` : "Prodavac preporucuje direktan kontakt za dodatne fotografije, dokumente i dogovor oko prevoza.",
    "Platforma preporucuje provjeru zdravstvene dokumentacije, identiteta prodavca i uslova kupoprodaje prije placanja."
  ].filter(Boolean).join(" ");
  response.json({ data: { description, fraudRisk: "LOW", spamScore: 0.08, recommendations: ["Dodajte video", "Dodajte mikrocip ili certifikat", "Ukljucite tacnu lokaciju"] } });
}));
