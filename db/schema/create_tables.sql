-- Create families table
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create unit_master table
CREATE TABLE unit_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_id UUID NOT NULL REFERENCES unit_master(id),
  increment_amount INTEGER NOT NULL,
  is_expiry_not_managed BOOLEAN NOT NULL DEFAULT false,
  expiry_date DATE,
  jan_code TEXT,
  memo TEXT,
  last_synced_token TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create shopping_list_items table
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
  custom_name TEXT,
  quantity INTEGER NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create usage_logs table
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  parameter_json JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_family_id ON profiles(family_id);
CREATE INDEX idx_ingredients_family_id ON ingredients(family_id);
CREATE INDEX idx_ingredients_storage_category ON ingredients(storage_category);
CREATE INDEX idx_shopping_lists_family_id ON shopping_lists(family_id);
CREATE INDEX idx_shopping_list_items_shopping_list_id ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);

-- Insert initial unit_master data
INSERT INTO unit_master (label, value) VALUES
  ('個', 'piece'),
  ('g', 'g'),
  ('kg', 'kg'),
  ('ml', 'ml'),
  ('本', 'bottle'),
  ('袋', 'bag'),
  ('パック', 'pack'),
  ('枚', 'sheet')
ON CONFLICT (value) DO NOTHING;
