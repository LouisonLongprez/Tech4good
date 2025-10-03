-- Script de nettoyage pour supprimer toutes les tables de progression
-- Utilisez ce script UNIQUEMENT si vous voulez tout recommencer à zéro

-- Supprimer les triggers en premier
DROP TRIGGER IF EXISTS update_user_formations_updated_at ON user_formations;
DROP TRIGGER IF EXISTS update_user_events_updated_at ON user_events;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Supprimer les politiques RLS
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

-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS user_documents;
DROP TABLE IF EXISTS user_events;
DROP TABLE IF EXISTS user_formations;
DROP TABLE IF EXISTS user_quiz_progress;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS create_user_settings();

-- Message de confirmation
SELECT 'Toutes les tables de progression ont été supprimées ✅' as result;