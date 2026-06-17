import type { Listing, Veterinarian, VeterinaryStation } from "@farma/shared";

export const demoListings: Listing[] = [
  {
    id: "1",
    slug: "simental-junica-travnik",
    title: "Simental junica sa papirima",
    description: "Mirno grlo, uredna vakcinacija, moguc pregled veterinara i organizovan prevoz.",
    price: 3200,
    currency: "BAM",
    type: "ANIMAL",
    category: "CATTLE",
    breed: "Simental",
    gender: "FEMALE",
    ageMonths: 18,
    weightKg: 420,
    color: "Smedja",
    location: "Travnik",
    latitude: 44.226,
    longitude: 17.665,
    vaccinated: true,
    pedigree: true,
    healthStatus: "Healthy",
    imageUrls: ["/listing-sheep.png"],
    videoUrls: [],
    owner: { id: "u1", fullName: "Farma Basic", phone: "+38761123456", verified: true, role: "VERIFIED_BREEDER" },
    phone: "+38761123456",
    whatsapp: "+38761123456",
    viber: "+38761123456",
    telegram: "@farma",
    views: 1840,
    favorites: 92,
    featured: true,
    urgent: false,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 45 * 86400000).toISOString()
  },
  {
    id: "2",
    slug: "traktor-imt-539",
    title: "IMT 539 spreman za sezonu",
    description: "Servisiran traktor, nove gume, registrovan, moguca zamjena za stoku.",
    price: 9800,
    currency: "BAM",
    type: "EQUIPMENT",
    category: "TRACTORS",
    location: "Bijeljina",
    imageUrls: ["/listing-horse.png"],
    videoUrls: [],
    owner: { id: "u2", fullName: "Agro Komerc", phone: "+38762123456", verified: true, role: "PREMIUM_USER" },
    views: 954,
    favorites: 36,
    featured: false,
    urgent: true,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
  },
  {
    id: "3",
    slug: "farma-sa-stalom-kiseljak",
    title: "Farma sa stajom i 6 hektara zemlje",
    description: "Pristupni put, voda, struja, staja za 40 grla i uredna dokumentacija.",
    price: 185000,
    currency: "BAM",
    type: "REAL_ESTATE",
    category: "FARMS",
    location: "Kiseljak",
    imageUrls: ["/listing-goats.png"],
    videoUrls: [],
    owner: { id: "u3", fullName: "Nekretnine Farma", verified: true, role: "PREMIUM_USER" },
    views: 2300,
    favorites: 144,
    featured: true,
    urgent: false,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 86400000).toISOString()
  }
];

export const demoVeterinarians: Veterinarian[] = [
  { id: "v1", fullName: "Dr. Amina Hadzic", specializations: ["Goveda", "Reprodukcija"], licenseNumber: "VET-BA-1042", experienceYears: 12, rating: 4.9, reviewCount: 88, city: "Sarajevo", emergencyAvailable: true, onlineConsultation: true },
  { id: "v2", fullName: "Dr. Marko Kovacevic", specializations: ["Konji", "Terenski rad"], licenseNumber: "VET-BA-1188", experienceYears: 9, rating: 4.7, reviewCount: 51, city: "Banja Luka", emergencyAvailable: true, onlineConsultation: false }
];

export const demoStations: VeterinaryStation[] = [
  { id: "s1", name: "Vet Centar Sarajevo", city: "Sarajevo", address: "Zmaja od Bosne 12", latitude: 43.8563, longitude: 18.4131, services: ["Vakcinacija", "Hirurgija", "Hitne intervencije"], rating: 4.8, openingHours: "08:00-20:00", emergencyContact: "+38761222000" },
  { id: "s2", name: "AgroVet Tuzla", city: "Tuzla", address: "Soli 8", latitude: 44.5384, longitude: 18.6671, services: ["Terenski izlazak", "Laboratorija"], rating: 4.6, openingHours: "07:00-18:00", emergencyContact: "+38762222000" }
];
