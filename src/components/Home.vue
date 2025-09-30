<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <div class="user-info">
          <img src="./personalpicture.png" class="avatar" />
        <div>
          <h1>Benoît</h1>
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

    <!-- Sections -->
    <section class="card">
      <h2>Documents & Infos pratiques</h2>
      <ul>
        <li>📄 Contrat signé</li>
        <li>📁 Documents administratifs</li>
        <li>▶️ Guide de passation</li>
      </ul>
    </section>

    <section class="card">
      <h2>Formations & Jeux</h2>
      <ul>
        <li>🎓 Formation interne</li>
        <li>❓ Quiz ludique</li>
        <li>🧩 Escape game</li>
      </ul>
    </section>

    <section class="card">
      <h2>Mentorat & Social</h2>
      <ul>
        <li>
          <router-link to="/calendrier" style="text-decoration: none; color: inherit;">
            🤝 Trouver un mentor
          </router-link>
        </li>
        <li>
          <router-link to="/calendrier" style="text-decoration: none; color: inherit;">
            👥 Reverse mentoring
          </router-link>
        </li>
        <li>🌍 Missions sociales</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// pas de logique encore
</script>

<style scoped>
.home {
  background: #f9fafb;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: sans-serif;
  color: #111;
}
.home > * {
  width: 100%;
  max-width: 600px;
}

.header {
  display: flex;
  justify-content: space-between;
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

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
  margin-bottom: 16px;
}

.card h2 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: bold;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
