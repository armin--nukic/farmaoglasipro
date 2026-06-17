CREATE TABLE IF NOT EXISTS marketplace_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_categories_type ON marketplace_categories(type);

INSERT INTO marketplace_categories (type, name, slug)
VALUES
  ('ANIMAL','Cattle','animal-cattle'),
  ('ANIMAL','Sheep','animal-sheep'),
  ('ANIMAL','Goats','animal-goats'),
  ('EQUIPMENT','Tractors','equipment-tractors'),
  ('EQUIPMENT','Trailers','equipment-trailers'),
  ('AGRICULTURE','Hay','agriculture-hay'),
  ('AGRICULTURE','Animal Feed','agriculture-animal-feed'),
  ('REAL_ESTATE','Farms','real-estate-farms'),
  ('REAL_ESTATE','Land','real-estate-land')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id, created_at DESC);
