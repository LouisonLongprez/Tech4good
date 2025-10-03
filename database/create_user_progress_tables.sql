-- Tables pour gérer la progression des utilisateurs Tech4Good
-- À exécuter dans le SQL Editor de Supabase

-- 1. Table pour les résultats des quiz
CREATE TABLE IF NOT EXISTS user_quiz_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_category TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB, -- Stocke les réponses de l'utilisateur (true/false pour chaque question)
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour la progression des formations
CREATE TABLE IF NOT EXISTS user_formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  formation_id TEXT NOT NULL, -- ID de la formation (correspond aux IDs dans le front)
  formation_title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'registered', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  registered_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un utilisateur ne peut avoir qu'une seule progression par formation
  UNIQUE(user_id, formation_id)
);

-- 3. Table pour les événements/calendrier utilisateur
CREATE TABLE IF NOT EXISTS user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  event_type TEXT DEFAULT 'meeting' CHECK (event_type IN ('formation', 'meeting', 'deadline', 'personal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table pour les documents utilisateur
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'health', 'guide', 'certification', 'other')),
  file_path TEXT, -- Chemin vers le fichier stocké
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  downloaded_at TIMESTAMP WITH TIME ZONE
);

-- 5. Table pour les paramètres utilisateur
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Europe/Paris',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_user_id ON user_quiz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_progress_category ON user_quiz_progress(quiz_category);
CREATE INDEX IF NOT EXISTS idx_user_formations_user_id ON user_formations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_formations_status ON user_formations(status);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_date ON user_events(start_date);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);

-- RLS (Row Level Security) pour toutes les tables
ALTER TABLE user_quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view own quiz progress" ON user_quiz_progress;
DROP POLICY IF EXISTS "Users can insert own quiz progress" ON user_quiz_progress;
DROP POLICY IF EXISTS "Users can update own quiz progress" ON user_quiz_progress;

DROP POLICY IF EXISTS "Users can view own formations" ON user_formations;
DROP POLICY IF EXISTS "Users can insert own formations" ON user_formations;
DROP POLICY IF EXISTS "Users can update own formations" ON user_formations;

DROP POLICY IF EXISTS "Users can view own events" ON user_events;
DROP POLICY IF EXISTS "Users can insert own events" ON user_events;
DROP POLICY IF EXISTS "Users can update own events" ON user_events;
DROP POLICY IF EXISTS "Users can delete own events" ON user_events;

DROP POLICY IF EXISTS "Users can view own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON user_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON user_documents;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- Politiques pour user_quiz_progress
CREATE POLICY "Users can view own quiz progress" ON user_quiz_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz progress" ON user_quiz_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz progress" ON user_quiz_progress FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour user_formations
CREATE POLICY "Users can view own formations" ON user_formations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own formations" ON user_formations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own formations" ON user_formations FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour user_events
CREATE POLICY "Users can view own events" ON user_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON user_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON user_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON user_events FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour user_documents
CREATE POLICY "Users can view own documents" ON user_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON user_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON user_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON user_documents FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour user_settings
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les triggers existants avant de les recréer
DROP TRIGGER IF EXISTS update_user_formations_updated_at ON user_formations;
DROP TRIGGER IF EXISTS update_user_events_updated_at ON user_events;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Triggers pour updated_at
CREATE TRIGGER update_user_formations_updated_at BEFORE UPDATE ON user_formations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_events_updated_at BEFORE UPDATE ON user_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement les paramètres utilisateur
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les paramètres
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- Commentaires pour la documentation
COMMENT ON TABLE user_quiz_progress IS 'Stocke les résultats des quiz pour chaque utilisateur';
COMMENT ON TABLE user_formations IS 'Suit la progression des formations par utilisateur';
COMMENT ON TABLE user_events IS 'Événements personnels du calendrier utilisateur';
COMMENT ON TABLE user_documents IS 'Documents uploadés par les utilisateurs';
COMMENT ON TABLE user_settings IS 'Paramètres et préférences utilisateur';

-- Insérer les documents de base pour tous les utilisateurs existants
INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Contrat de travail Tech4Good' as document_name,
  'contract' as document_type,
  created_at as uploaded_at
FROM profiles 
ON CONFLICT DO NOTHING;

INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Guide d''accueil et onboarding' as document_name,
  'guide' as document_type,
  created_at as uploaded_at
FROM profiles 
ON CONFLICT DO NOTHING;

INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Politique de confidentialité' as document_name,
  'other' as document_type,
  created_at as uploaded_at
FROM profiles 
ON CONFLICT DO NOTHING;

-- Afficher un message de confirmation
SELECT 'Tables de progression créées avec succès ! ✅' as result;