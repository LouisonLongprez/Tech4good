<template>
  <div class="home">
    <!-- Header -->
    <header class="header">
      <div class="user-info">
        <!-- Avatar personnel -->
        <img src="./personalpicture.png" class="avatar" />
        <div>
          <h1>Alexis</h1>
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
        <li>
          <button class="link-btn" @click="showModal = true">📄 Contrat signé</button>
        </li>
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

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <button class="close-btn" @click="showModal = false">✖</button>
        <img :src="contractImg" alt="Contrat signé" class="modal-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import contractImg from "@/assets/Faux_contrat.jpg"; // image du contrat

const showModal = ref(false);
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
  object-fit: cover;
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

/* bouton style lien */
.link-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  color: inherit;
  text-align: left;
}
.link-btn:hover {
  text-decoration: underline;
}

/* MODALE */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  position: relative;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  max-width: 90%;
  max-height: 90%;
}

.modal-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
