-- Sample data for testing
-- This file contains sample data for development/testing purposes only

-- Insert sample unit_master data (required for items)
INSERT INTO unit_master (name) VALUES
  ('g'),
  ('kg'),
  ('ml'),
  ('bottle'),
  ('bag'),
  ('pack'),
  ('sheet')
ON CONFLICT (name) DO NOTHING;

-- Example: Insert a sample family
-- INSERT INTO families (name, invite_code) VALUES
--   ('Tanaka Family', 'FAMILYABC123'),
--   ('Sato Family', 'FAMILYDEF456');

-- Example: Insert sample profiles (requires auth.users to exist first)
-- INSERT INTO profiles (id, family_id, name) VALUES
--   ('user-uuid-1', 'family-uuid-1', 'Tanaka Taro'),
--   ('user-uuid-2', 'family-uuid-1', 'Tanaka Hanako');

-- Example: Insert sample items
-- INSERT INTO items (family_id, name, storage_category, quantity, unit_id, increment_amount, is_expiry_not_managed, expiry_date) VALUES
--   ('family-uuid-1', 'Apple', 'refrigerated', 5, 'unit-uuid-piece', 1, false, '2025-11-30'),
--   ('family-uuid-1', 'Milk', 'refrigerated', 2, 'unit-uuid-bottle', 1, false, '2025-11-10');
