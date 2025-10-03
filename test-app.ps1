# Script de test pour Tech4Good
# Utilisation : .\test-app.ps1

Write-Host "🚀 Test Tech4Good - Vérification du système de progression" -ForegroundColor Green
Write-Host "="*60

# Vérifier si Node.js est installé
Write-Host "📦 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installé : $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# Vérifier si npm est disponible
Write-Host "📦 Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installé : $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm non trouvé." -ForegroundColor Red
    exit 1
}

# Installer les dépendances si nécessaire
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}

# Vérifier la configuration Supabase
Write-Host "🔧 Vérification de la configuration..." -ForegroundColor Yellow
if (!(Test-Path "src/lib/supabase.js")) {
    Write-Host "❌ Fichier supabase.js non trouvé" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Configuration Supabase trouvée" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Points de test à vérifier :" -ForegroundColor Cyan
Write-Host "1. Créer un nouveau compte utilisateur" -ForegroundColor White
Write-Host "2. Vérifier que tous les compteurs sont à zéro SAUF documents (3)" -ForegroundColor White
Write-Host "3. Compléter un quiz et vérifier l'incrémentation" -ForegroundColor White
Write-Host "4. Tester les formations et événements" -ForegroundColor White
Write-Host "5. Vérifier la persistence des données" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
Write-Host ""

# Démarrer le serveur de développement
npm run dev