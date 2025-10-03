-- Script de test pour vérifier les données utilisateur
-- À exécuter pour voir les statistiques de chaque utilisateur

-- 1. Voir tous les utilisateurs et leurs documents
SELECT 
  p.first_name || ' ' || p.last_name as nom_utilisateur,
  p.email,
  p.role,
  COUNT(DISTINCT ud.id) as documents_count,
  COUNT(DISTINCT uq.id) as quiz_completed,
  COUNT(DISTINCT uf.id) as formations_count
FROM profiles p
LEFT JOIN user_documents ud ON p.id = ud.user_id
LEFT JOIN user_quiz_progress uq ON p.id = uq.user_id
LEFT JOIN user_formations uf ON p.id = uf.user_id AND uf.status = 'completed'
GROUP BY p.id, p.first_name, p.last_name, p.email, p.role
ORDER BY p.created_at DESC;

-- 2. Détail des documents par utilisateur
SELECT 
  p.first_name || ' ' || p.last_name as utilisateur,
  ud.document_name,
  ud.document_type,
  ud.uploaded_at
FROM profiles p
JOIN user_documents ud ON p.id = ud.user_id
ORDER BY p.first_name, ud.uploaded_at;

-- 3. Statistiques globales
SELECT 
  'Total utilisateurs' as metric,
  COUNT(*) as valeur
FROM profiles
UNION ALL
SELECT 
  'Total documents',
  COUNT(*)
FROM user_documents
UNION ALL
SELECT 
  'Total quiz terminés',
  COUNT(*)
FROM user_quiz_progress
UNION ALL
SELECT 
  'Total formations en cours/terminées',
  COUNT(*)
FROM user_formations;

-- 4. Test d'un utilisateur spécifique (remplacez l'email)
/*
SELECT 
  'Quiz terminés' as type,
  COUNT(*) as nombre
FROM user_quiz_progress uq
JOIN profiles p ON uq.user_id = p.id
WHERE p.email = 'votre-email@example.com'
UNION ALL
SELECT 
  'Documents',
  COUNT(*)
FROM user_documents ud
JOIN profiles p ON ud.user_id = p.id
WHERE p.email = 'votre-email@example.com'
UNION ALL
SELECT 
  'Formations terminées',
  COUNT(*)
FROM user_formations uf
JOIN profiles p ON uf.user_id = p.id
WHERE p.email = 'votre-email@example.com' AND uf.status = 'completed';
*/