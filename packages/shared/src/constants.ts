export const currencies = ["BAM", "EUR"] as const;

export const userRoles = [
  "GUEST",
  "REGISTERED_USER",
  "VERIFIED_BREEDER",
  "VETERINARIAN",
  "VETERINARY_STATION",
  "PREMIUM_USER",
  "MODERATOR",
  "ADMINISTRATOR",
  "SUPER_ADMIN"
] as const;

export const animalCategories = [
  "CATTLE",
  "COWS",
  "BULLS",
  "CALVES",
  "SHEEP",
  "RAMS",
  "LAMBS",
  "GOATS",
  "HORSES",
  "DONKEYS",
  "PIGS",
  "POULTRY",
  "CHICKENS",
  "DUCKS",
  "TURKEYS",
  "GEESE",
  "DOGS",
  "CATS",
  "RABBITS",
  "BEES",
  "FISH",
  "EXOTIC_ANIMALS"
] as const;

export const listingTypes = ["ANIMAL", "EQUIPMENT", "AGRICULTURE", "REAL_ESTATE"] as const;

export const equipmentCategories = [
  "TRACTORS",
  "HARVESTERS",
  "ATTACHMENTS",
  "PLOWS",
  "SEEDERS",
  "TRAILERS",
  "IRRIGATION_SYSTEMS",
  "GENERATORS",
  "TOOLS"
] as const;

export const agricultureCategories = [
  "HAY",
  "CORN",
  "WHEAT",
  "BARLEY",
  "OATS",
  "ANIMAL_FEED",
  "SEEDS",
  "FERTILIZER"
] as const;

export const realEstateCategories = [
  "FARMS",
  "LAND",
  "BARNS",
  "STABLES",
  "AGRICULTURAL_BUILDINGS"
] as const;
