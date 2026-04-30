-- 🔥 EXTENSION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 🔥 ORGANIZATION (dynamic id)
INSERT INTO organizations (id, name)
VALUES (
  gen_random_uuid(),
  'WatchDawg Demo Org'
)
ON CONFLICT DO NOTHING;

-- 🔥 ADMIN USER
INSERT INTO users (
  id,
  full_name,
  email,
  password,
  role,
  organization_id,
  is_active,
  is_deleted,
  is_first_login
)
SELECT
  gen_random_uuid(),
  'Admin User',
  'admin@test.com',
  '$2b$10$E9dnretaIoZmQhFET.CPYeT6zOHruZGBSYZBcNacM5xo0XaeUW6Cq',
  'admin',
  o.id,
  true,
  false,
  false
FROM organizations o
LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- 🔥 EMPLOYEE USER
INSERT INTO users (
  id,
  full_name,
  email,
  password,
  role,
  organization_id,
  is_active,
  is_deleted,
  is_first_login
)
SELECT
  gen_random_uuid(),
  'Demo Employee',
  'employee@test.com',
  '$2b$10$E9dnretaIoZmQhFET.CPYeT6zOHruZGBSYZBcNacM5xo0XaeUW6Cq',
  'employee',
  o.id,
  true,
  false,
  false
FROM organizations o
LIMIT 1
ON CONFLICT (email) DO NOTHING;
