-- Script simple pour créer la table profiles si elle n'existe pas encore
-- À utiliser si vous préférez créer manuellement sans les triggers automatiques

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Nouvel arrivant', 'Manager', 'RH')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité basiques
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux RH de voir tous les profils
DROP POLICY IF EXISTS "RH can view all profiles" ON profiles;
CREATE POLICY "RH can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'RH'
  ) OR auth.uid() = id
);

-- Commentaires pour documentation
COMMENT ON TABLE profiles IS 'Profils utilisateurs de la plateforme Tech4Good';
COMMENT ON COLUMN profiles.id IS 'ID utilisateur (référence auth.users)';
COMMENT ON COLUMN profiles.email IS 'Adresse email de l''utilisateur';
COMMENT ON COLUMN profiles.first_name IS 'Prénom de l''utilisateur';
COMMENT ON COLUMN profiles.last_name IS 'Nom de famille de l''utilisateur';
COMMENT ON COLUMN profiles.role IS 'Rôle dans l''organisation (Nouvel arrivant, Manager, RH)';
COMMENT ON COLUMN profiles.created_at IS 'Date de création du profil';
COMMENT ON COLUMN profiles.updated_at IS 'Date de dernière mise à jour du profil';
