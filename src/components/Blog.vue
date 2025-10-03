<template>
  <div class="blog-page">
    <h1>📝 Blog Tech4Good</h1>
    
    <div class="blog-grid">
      <article class="blog-post">
        <div class="post-image">
          <div class="image-placeholder">🌍</div>
        </div>
        <div class="post-content">
          <h3>Notre dernière mission sociale</h3>
          <p class="post-meta">Par Sarah M. • Il y a 2 jours</p>
          <p>Découvrez comment notre équipe a aidé une association locale à digitaliser ses processus...</p>
          <router-link to="#" class="read-more">Lire la suite →</router-link>
        </div>
      </article>

      <article class="blog-post">
        <div class="post-image">
          <div class="image-placeholder">🎓</div>
        </div>
        <div class="post-content">
          <h3>Témoignage : Mon premier mois chez Tech4Good</h3>
          <p class="post-meta">Par Alexis D. • Il y a 1 semaine</p>
          <p>Une intégration réussie grâce au programme d'onboarding et au soutien de l'équipe...</p>
          <router-link to="#" class="read-more">Lire la suite →</router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  padding: 2rem;
  padding-top: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  background: #f9fafb;
  min-height: calc(100vh - 140px);
}

.blog-grid {
  display: grid;
  gap: 2rem;
}

.blog-post {
  display: flex;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-image {
  width: 120px;
  flex-shrink: 0;
}

.image-placeholder {
  width: 120px;
  height: 120px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.post-content {
  flex: 1;
}

.post-meta {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.read-more {
  color: #3b82f6;
  text-decoration: none;
  font-weight: bold;
}

.read-more:hover {
  text-decoration: underline;
}
</style>