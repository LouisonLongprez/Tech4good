-- Script pour initialiser les documents existants Tech4Good
-- À exécuter APRÈS avoir créé les tables de progression

-- Insérer les 3 documents de base pour tous les utilisateurs existants
INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Contrat de travail Tech4Good' as document_name,
  'contract' as document_type,
  created_at as uploaded_at
FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT user_id FROM user_documents WHERE document_type = 'contract'
);

INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Guide d''accueil et onboarding' as document_name,
  'guide' as document_type,
  created_at as uploaded_at
FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT user_id FROM user_documents WHERE document_type = 'guide'
);

INSERT INTO user_documents (user_id, document_name, document_type, uploaded_at) 
SELECT 
  id as user_id,
  'Politique de confidentialité' as document_name,
  'other' as document_type,
  created_at as uploaded_at
FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT user_id FROM user_documents WHERE document_type = 'other'
);

-- Vérifier le résultat
SELECT 
  p.first_name || ' ' || p.last_name as utilisateur,
  COUNT(ud.id) as nombre_documents
FROM profiles p
LEFT JOIN user_documents ud ON p.id = ud.user_id
GROUP BY p.id, p.first_name, p.last_name
ORDER BY p.created_at;

-- Message de confirmation
SELECT 'Documents de base initialisés pour tous les utilisateurs ! 📁✅' as result;