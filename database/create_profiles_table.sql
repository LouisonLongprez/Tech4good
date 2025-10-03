-- Création de la table profiles pour Tech4Good
-- Cette table stocke les informations des utilisateurs

-- Supprime la table si elle existe (attention: supprime toutes les données!)
-- DROP TABLE IF EXISTS profiles;

-- Création de la table profiles
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

-- Politique pour que les utilisateurs ne puissent voir que leur propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Politique pour que les utilisateurs puissent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Politique pour permettre l'insertion lors de l'inscription
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Politique supplémentaire pour permettre l'insertion via trigger
DROP POLICY IF EXISTS "Enable insert during signup" ON profiles;
CREATE POLICY "Enable insert during signup" 
ON profiles FOR INSERT 
WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Nouvel arrivant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Commentaires pour documentation
COMMENT ON TABLE profiles IS 'Profils utilisateurs de la plateforme Tech4Good';
COMMENT ON COLUMN profiles.id IS 'ID utilisateur (référence auth.users)';
COMMENT ON COLUMN profiles.email IS 'Adresse email de l''utilisateur';
COMMENT ON COLUMN profiles.first_name IS 'Prénom de l''utilisateur';
COMMENT ON COLUMN profiles.last_name IS 'Nom de famille de l''utilisateur';
COMMENT ON COLUMN profiles.role IS 'Rôle dans l''organisation (Nouvel arrivant, Manager, RH)';
COMMENT ON COLUMN profiles.created_at IS 'Date de création du profil';
COMMENT ON COLUMN profiles.updated_at IS 'Date de dernière mise à jour du profil';