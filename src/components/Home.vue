<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <div class="user-info">
        <img src="./personalpicture.png" class="avatar" />
        <div>
          <h1>Alexandre</h1>
          <p>Matricule #873873</p>
        </div>
      </div>
      <div class="roadmap">
        <span>Roadmap 6 mois</span>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
      </div>
    </header>

    <!-- Grille de cartes 3x3 -->
    <div class="cards-grid">
      <!-- Documents & Infos pratiques -->
      <div class="card">📄 Contrat signé</div>
      <div class="card">📁 Documents administratifs</div>
      <div class="card">▶️ Guide de passation</div>

      <!-- Formations & Jeux -->
      <div class="card">🎓 Formation interne</div>
      <div class="card">❓ Quiz ludique</div>
      <div class="card">🧩 Escape game</div>

      <!-- Mentorat & Social -->
      <div class="card">
        <router-link to="/calendrier" style="text-decoration: none; color: inherit;">
          🤝 Trouver un mentor
        </router-link>
      </div>
      <div class="card">
        <router-link to="/calendrier" style="text-decoration: none; color: inherit;">
          👥 Reverse mentoring
        </router-link>
      </div>
      <div class="card">🌍 Missions sociales</div>
    </div>
  </div>
</template>

<script setup>
// pas de logique pour l'instant
</script>

<style scoped>
.home {
  background: #f9fafb;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  color: #111;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 960px;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.roadmap {
  text-align: right;
}

.progress-bar {
  width: 150px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-top: 5px;
}

.progress {
  width: 40%;
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 960px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
  font-size: 14px;
  text-align: center;
}
</style>
