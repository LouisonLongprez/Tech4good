<template>
  <div class="escape-game-page">
    <div class="game-header">
      <h1>🧩 Escape Game Tech4Good</h1>
      <div class="game-stats">
        <div class="stat">
          <span class="stat-label">Niveau</span>
          <span class="stat-value">2/5</span>
        </div>
        <div class="stat">
          <span class="stat-label">Points</span>
          <span class="stat-value">340</span>
        </div>
        <div class="stat">
          <span class="stat-label">Temps restant</span>
          <span class="stat-value">3 sem.</span>
        </div>
      </div>
    </div>

    <div class="current-mission">
      <h2>🎯 Mission actuelle : Découverte terrain</h2>
      <p>Votre mission est de visiter une association partenaire et comprendre leurs défis technologiques.</p>
      
      <div class="mission-steps">
        <div class="step completed">
          <span class="step-icon">✅</span>
          <span>Prendre contact avec l'association</span>
        </div>
        <div class="step active">
          <span class="step-icon">🔄</span>
          <span>Planifier la visite</span>
        </div>
        <div class="step">
          <span class="step-icon">⏳</span>
          <span>Réaliser l'audit</span>
        </div>
        <div class="step">
          <span class="step-icon">⏳</span>
          <span>Proposer des solutions</span>
        </div>
      </div>

      <button class="continue-btn">Continuer la mission →</button>
    </div>

    <div class="levels-progress">
      <h3>🏆 Progression des niveaux</h3>
      <div class="levels-grid">
        <div class="level-card completed">
          <span class="level-number">1</span>
          <h4>Découverte</h4>
          <p>✅ Terminé</p>
        </div>
        <div class="level-card active">
          <span class="level-number">2</span>
          <h4>Terrain</h4>
          <p>🔄 En cours</p>
        </div>
        <div class="level-card locked">
          <span class="level-number">3</span>
          <h4>Expert</h4>
          <p>🔒 Verrouillé</p>
        </div>
        <div class="level-card locked">
          <span class="level-number">4</span>
          <h4>Leader</h4>
          <p>🔒 Verrouillé</p>
        </div>
        <div class="level-card locked">
          <span class="level-number">5</span>
          <h4>Mentor</h4>
          <p>🔒 Verrouillé</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.escape-game-page {
  padding: 2rem;
  padding-top: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: calc(100vh - 140px);
  color: white;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.game-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.current-mission {
  background: white;
  color: #374151;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.mission-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f9fafb;
}

.step.completed {
  background: #d1fae5;
}

.step.active {
  background: #dbeafe;
  border: 2px solid #3b82f6;
}

.step-icon {
  font-size: 1.2rem;
}

.continue-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.levels-progress {
  background: white;
  color: #374151;
  padding: 2rem;
  border-radius: 16px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.level-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
}

.level-card.completed {
  background: #d1fae5;
  border-color: #10b981;
}

.level-card.active {
  background: #dbeafe;
  border-color: #3b82f6;
}

.level-card.locked {
  opacity: 0.5;
}

.level-number {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .game-stats {
    justify-content: center;
  }
}</style>