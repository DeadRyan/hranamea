-- ============================================================
-- Migrare: Adaugă coloane pentru datele personale ale user-ului
-- Tabela: user_ai_profiles
-- Data:  29 Mai 2026
-- ============================================================

-- 1. Adaugă coloanele pentru datele corporale
ALTER TABLE user_ai_profiles 
  ADD COLUMN height DECIMAL(5,1) NULL COMMENT 'Înălțimea în cm',
  ADD COLUMN weight DECIMAL(5,1) NULL COMMENT 'Greutatea în kg',
  ADD COLUMN age INT NULL COMMENT 'Vârsta în ani',
  ADD COLUMN diabetes_type VARCHAR(50) NULL COMMENT 'Tip diabet (Type 1, Type 2, Gestational, etc.)';

-- 2. (Opțional) Dacă tabela nu are coloana allergies, decomentează linia de mai jos:
-- ALTER TABLE user_ai_profiles ADD COLUMN allergies TEXT NULL COMMENT 'Alergii și intoleranțe';

-- ============================================================
-- Verificare: rulează această interogare după migrare
-- ============================================================
-- DESCRIBE user_ai_profiles;
