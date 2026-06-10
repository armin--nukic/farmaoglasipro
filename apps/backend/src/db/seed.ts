import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

interface IdRow {
  id: string;
}

const cities = ["Sarajevo", "Banja Luka", "Tuzla", "Mostar", "Zenica", "Bihac", "Brcko", "Travnik", "Bijeljina", "Livno"];
const breeds = ["Simental", "Busha", "Holstein", "Romanovska", "Alpina", "Lipicaner", "Berkshire", "Koka nosilja"];

async function seed() {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE notifications, messages, conversations, bids, auctions, reviews, appointments, animal_health_records, animals, listings, farms, veterinary_stations, veterinarians, users RESTART IDENTITY CASCADE");

    const superAdmin = await pool.query<IdRow>(
      "INSERT INTO users (email, password_hash, full_name, phone, role, verified, city) VALUES ($1,$2,$3,$4,$5,true,$6) RETURNING id",
      ["superadmin@farmaoglasi.pro", passwordHash, "Super Admin", "+38761000000", "SUPER_ADMIN", "Sarajevo"]
    );

    for (let i = 1; i <= 5; i += 1) {
      await pool.query(
        "INSERT INTO users (email, password_hash, full_name, phone, role, verified, city) VALUES ($1,$2,$3,$4,$5,true,$6)",
        [`admin${i}@farmaoglasi.pro`, passwordHash, `Administrator ${i}`, `+38761000${i}`, "ADMINISTRATOR", cities[i % cities.length]]
      );
    }

    const userIds: string[] = [superAdmin.rows[0]!.id];
    const testUser = await pool.query<IdRow>(
      "INSERT INTO users (email, password_hash, full_name, phone, role, verified, city) VALUES ($1,$2,$3,$4,$5,true,$6) RETURNING id",
      ["testuser@farmaoglasi.pro", passwordHash, "Test Korisnik", "+38761111222", "REGISTERED_USER", "Sarajevo"]
    );
    userIds.push(testUser.rows[0]!.id);

    for (let i = 1; i <= 50; i += 1) {
      const role = i % 7 === 0 ? "VERIFIED_BREEDER" : i % 11 === 0 ? "PREMIUM_USER" : "REGISTERED_USER";
      const result = await pool.query<IdRow>(
        "INSERT INTO users (email, password_hash, full_name, phone, role, verified, city) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [`user${i}@farmaoglasi.pro`, passwordHash, `Korisnik ${i}`, `+38762${String(i).padStart(6, "0")}`, role, i % 3 !== 0, cities[i % cities.length]]
      );
      userIds.push(result.rows[0]!.id);
    }

    const vetIds: string[] = [];
    for (let i = 1; i <= 20; i += 1) {
      const user = await pool.query<IdRow>(
        "INSERT INTO users (email, password_hash, full_name, phone, role, verified, city) VALUES ($1,$2,$3,$4,'VETERINARIAN',true,$5) RETURNING id",
        [`vet${i}@farmaoglasi.pro`, passwordHash, `Dr. Vet ${i}`, `+38763${String(i).padStart(6, "0")}`, cities[i % cities.length]]
      );
      const vet = await pool.query<IdRow>(
        "INSERT INTO veterinarians (user_id, license_number, specializations, experience_years, emergency_available, online_consultation, rating) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [user.rows[0]!.id, `VET-BA-${1000 + i}`, ["large animals", "vaccination", "reproduction"], 2 + (i % 18), i % 2 === 0, i % 3 === 0, 4 + (i % 10) / 10]
      );
      vetIds.push(vet.rows[0]!.id);
    }

    for (let i = 1; i <= 10; i += 1) {
      await pool.query(
        "INSERT INTO veterinary_stations (name, city, address, latitude, longitude, services, opening_hours, emergency_contact, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [`Veterinarska stanica ${i}`, cities[i % cities.length], `Adresa ${i}`, 43.8 + i / 100, 18.3 + i / 100, ["vaccination", "surgery", "field visit"], "08:00-18:00", `+38764${String(i).padStart(6, "0")}`, 4.2]
      );
    }

    const farmIds: string[] = [];
    for (let i = 1; i <= 50; i += 1) {
      const farm = await pool.query<IdRow>(
        "INSERT INTO farms (owner_id, name, description, city, latitude, longitude, followers, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
        [userIds[i % userIds.length], `Farma ${i}`, `Porodicna farma sa kvalitetnim uzgojem broj ${i}.`, cities[i % cities.length], 43.7 + i / 150, 18.2 + i / 150, i * 3, 4 + (i % 9) / 10]
      );
      farmIds.push(farm.rows[0]!.id);
    }

    const animalIds: string[] = [];
    for (let i = 1; i <= 100; i += 1) {
      const animal = await pool.query<IdRow>(
        "INSERT INTO animals (owner_id, farm_id, name, animal_id, microchip_number, category, breed, birth_date, weight_kg, health_status, qr_code_url) VALUES ($1,$2,$3,$4,$5,$6,$7,current_date - ($8 || ' months')::interval,$9,$10,$11) RETURNING id",
        [userIds[i % userIds.length], farmIds[i % farmIds.length], `Zivotinja ${i}`, `BA-AN-${10000 + i}`, `CHIP-${100000 + i}`, i % 2 === 0 ? "CATTLE" : "SHEEP", breeds[i % breeds.length], 6 + i, 80 + i * 4, "Healthy", `/qr/animal-${i}.png`]
      );
      animalIds.push(animal.rows[0]!.id);
      await pool.query("INSERT INTO animal_health_records (animal_id, record_type, title, notes, veterinarian_id, recorded_at) VALUES ($1,'VACCINATION',$2,$3,$4,now() - interval '30 days')", [animal.rows[0]!.id, "Redovna vakcinacija", "Bez komplikacija.", vetIds[i % vetIds.length]]);
    }

    for (let i = 1; i <= 300; i += 1) {
      const type = i % 4 === 0 ? "REAL_ESTATE" : i % 3 === 0 ? "EQUIPMENT" : i % 5 === 0 ? "AGRICULTURE" : "ANIMAL";
      await pool.query(
        `INSERT INTO listings
        (owner_id, animal_id, title, slug, description, price, currency, type, category, breed, gender, age_months, weight_kg, color, location, latitude, longitude, vaccinated, pedigree, health_status, image_urls, video_urls, phone, whatsapp, viber, telegram, views, favorites, featured, urgent, expires_at)
        VALUES ($1,$2,$3,$4,$5,$6,'BAM',$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,now() + interval '60 days')`,
        [
          userIds[i % userIds.length],
          type === "ANIMAL" ? animalIds[i % animalIds.length] : null,
          `${type === "ANIMAL" ? "Kvalitetno grlo" : type === "EQUIPMENT" ? "Poljoprivredna oprema" : type === "REAL_ESTATE" ? "Seosko imanje" : "Hrana za zivotinje"} ${i}`,
          `oglas-${i}`,
          "Detaljan opis oglasa sa provjerenim informacijama, dokumentima i kontakt podacima prodavca.",
          100 + i * 25,
          type,
          type === "EQUIPMENT" ? "TRACTORS" : type === "REAL_ESTATE" ? "FARMS" : "CATTLE",
          breeds[i % breeds.length],
          i % 2 === 0 ? "FEMALE" : "MALE",
          10 + i,
          150 + i,
          "Smedja",
          cities[i % cities.length],
          43.8 + i / 1000,
          18.3 + i / 1000,
          true,
          i % 4 === 0,
          "Healthy",
          [`https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80`],
          [],
          "+38761123456",
          "+38761123456",
          "+38761123456",
          "@farma",
          i * 8,
          i % 40,
          i % 9 === 0,
          i % 13 === 0
        ]
      );
    }

    for (let i = 1; i <= 100; i += 1) {
      await pool.query("INSERT INTO reviews (reviewer_id, target_user_id, rating, body, target_type) VALUES ($1,$2,$3,$4,$5)", [userIds[i % userIds.length], userIds[(i + 1) % userIds.length], 3 + (i % 3), `Pouzdana saradnja broj ${i}.`, "SELLER"]);
    }

    for (let i = 1; i <= 15; i += 1) {
      const auction = await pool.query<IdRow>("INSERT INTO auctions (listing_id, starts_at, ends_at, starting_price, current_price, status) SELECT id, now(), now() + interval '7 days', price * 0.8, price, 'ACTIVE' FROM listings ORDER BY id LIMIT 1 OFFSET $1 RETURNING id", [i]);
      await pool.query("INSERT INTO bids (auction_id, bidder_id, amount, auto_bid_limit) VALUES ($1,$2,$3,$4)", [auction.rows[0]!.id, userIds[i % userIds.length], 500 + i * 40, 700 + i * 50]);
    }

    await pool.query("COMMIT");
    console.log("Seeded FARMA OGLASI PRO demo data.");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
