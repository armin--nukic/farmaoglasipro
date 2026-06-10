CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'REGISTERED_USER',
  verified boolean NOT NULL DEFAULT false,
  city text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE farms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  city text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  photos text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  followers int NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE animals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_id uuid REFERENCES farms(id) ON DELETE SET NULL,
  name text,
  animal_id text NOT NULL UNIQUE,
  microchip_number text UNIQUE,
  category text NOT NULL,
  breed text NOT NULL,
  birth_date date,
  weight_kg numeric(10,2),
  health_status text,
  pedigree_tree jsonb NOT NULL DEFAULT '{}'::jsonb,
  certificates text[] NOT NULL DEFAULT '{}',
  documents text[] NOT NULL DEFAULT '{}',
  photos text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  qr_code_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE animal_health_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  title text NOT NULL,
  notes text,
  veterinarian_id uuid,
  prescription text,
  next_due_at timestamptz,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE veterinarians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number text NOT NULL UNIQUE,
  specializations text[] NOT NULL DEFAULT '{}',
  experience_years int NOT NULL DEFAULT 0,
  working_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  emergency_available boolean NOT NULL DEFAULT false,
  online_consultation boolean NOT NULL DEFAULT false,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE veterinary_stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  latitude numeric(9,6) NOT NULL,
  longitude numeric(9,6) NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  photos text[] NOT NULL DEFAULT '{}',
  opening_hours text NOT NULL,
  emergency_contact text NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES animals(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  price numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'BAM',
  type text NOT NULL,
  category text NOT NULL,
  breed text,
  gender text,
  age_months int,
  weight_kg numeric(10,2),
  color text,
  location text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  vaccinated boolean NOT NULL DEFAULT false,
  pedigree boolean NOT NULL DEFAULT false,
  health_status text,
  image_urls text[] NOT NULL DEFAULT '{}',
  video_urls text[] NOT NULL DEFAULT '{}',
  phone text,
  whatsapp text,
  viber text,
  telegram text,
  views int NOT NULL DEFAULT 0,
  favorites int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  urgent boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  veterinarian_id uuid NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  reminder_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  veterinarian_id uuid REFERENCES veterinarians(id) ON DELETE CASCADE,
  station_id uuid REFERENCES veterinary_stations(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  target_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auctions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  starting_price numeric(12,2) NOT NULL,
  current_price numeric(12,2) NOT NULL,
  winner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id uuid NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  auto_bid_limit numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  buyer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text,
  file_url text,
  voice_url text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  channel text NOT NULL DEFAULT 'REALTIME',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status text NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'BAM',
  status text NOT NULL,
  invoice_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_type_category ON listings(type, category);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_geo ON listings(latitude, longitude);
CREATE INDEX idx_listings_featured ON listings(featured, urgent, published_at DESC);
CREATE INDEX idx_animals_owner ON animals(owner_id);
CREATE INDEX idx_appointments_vet_time ON appointments(veterinarian_id, scheduled_at);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
