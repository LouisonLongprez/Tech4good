<template>
  <div class="onboarding-container">
    <!-- Header Modern -->
    <div class="header-section">
      <div class="progress-indicator">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(completedMissions.length / missions.length) * 100}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ completedMissions.length }}/{{ missions.length }} missions accomplies</span>
      </div>
      <h1 class="main-title">Intégration Tech4Good</h1>
      <p class="subtitle">Découvrez votre équipe à travers des missions interactives</p>
    </div>

    <!-- Mission du jour - Card moderne -->
    <div class="current-mission-card" v-if="currentMission">
      <div class="mission-header">
        <div class="mission-day">Jour {{ currentMission.day }}</div>
        <div class="mission-status">En cours</div>
      </div>
      
      <h2 class="mission-title">{{ currentMission.title }}</h2>
      <p class="mission-description">{{ currentMission.description }}</p>
      
      <div class="mission-meta">
        <div class="meta-item">
          <v-icon icon="mdi-account" size="small"></v-icon>
          <span>{{ currentMission.target }}</span>
        </div>
        <div class="meta-item">
          <v-icon icon="mdi-map-marker" size="small"></v-icon>
          <span>{{ currentMission.location }}</span>
        </div>
      </div>

      <!-- Action principale -->
      <div class="action-section">
        <div class="action-header">
          <v-icon icon="mdi-handshake" color="primary"></v-icon>
          <span>Action à réaliser</span>
        </div>
        
        <div class="action-description">
          Rendez-vous à {{ currentMission.location }} pour rencontrer {{ currentMission.target }} et découvrir {{ currentMission.objective.toLowerCase() }}.
        </div>
        
        <div class="completion-section">
          <v-btn 
            @click="completeMission"
            color="primary"
            size="large"
            block
            prepend-icon="mdi-check-circle"
            class="complete-mission-btn"
          >
            J'ai terminé cette mission !
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Mission complétée -->
    <div v-else-if="completedMissions.length === missions.length" class="completion-card">
      <div class="completion-icon">🎉</div>
      <h2>Félicitations !</h2>
      <p>Vous avez terminé toutes vos missions d'intégration.</p>
      <p>Bienvenue officiellement dans l'équipe Tech4Good !</p>
    </div>

    <!-- Timeline compacte et moderne -->
    <div class="missions-overview">
      <h3 class="section-title">Vue d'ensemble de votre parcours</h3>
      
      <div class="missions-grid">
        <div 
          v-for="mission in missions" 
          :key="mission.id"
          :class="['mission-item', {
            'completed': completedMissions.includes(mission.id),
            'current': mission.id === currentMissionId,
            'upcoming': mission.id > currentMissionId
          }]"
        >
          <div class="mission-number">{{ mission.day }}</div>
          <div class="mission-content">
            <h4>{{ mission.title }}</h4>
            <p>{{ mission.target }}</p>
          </div>
          <div class="mission-icon">
            <v-icon v-if="completedMissions.includes(mission.id)" icon="mdi-check" color="success"></v-icon>
            <v-icon v-else-if="mission.id === currentMissionId" icon="mdi-play" color="primary"></v-icon>
            <v-icon v-else icon="mdi-lock" color="grey"></v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog de félicitations moderne -->
    <v-dialog v-model="showCongratulations" max-width="400" persistent>
      <v-card class="celebration-card">
        <v-card-text class="text-center pa-8">
          <div class="celebration-icon">✨</div>
          <h3 class="mb-4">Mission accomplie !</h3>
          <p class="mb-4">Excellent travail ! Vous progressez dans votre intégration.</p>
          <v-btn 
            @click="showCongratulations = false" 
            color="primary"
            block
          >
            Continuer
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

export default {
  name: 'EscapeGame',
  setup() {
    const { user } = useUser()
    
    const userAnswer = ref('')
    const showValidation = ref(false)
    const isCorrectAnswer = ref(false)
    const validationMessage = ref('')
    const showCongratulations = ref(false)
    const showHint = ref(false)
    const completedMissions = ref([])
    const currentMissionId = ref(1)

    const missions = ref([
      {
        id: 1,
        day: 1,
        title: "Découverte Créative",
        target: "Designer Graphique",
        location: "Bureau Design - Étage 2",
        objective: "Comprendre l'identité visuelle Tech4Good",
        description: "Rencontrez notre Designer Graphique pour découvrir comment nous créons des visuels qui inspirent l'engagement social."
      },
      {
        id: 2,
        day: 2,
        title: "Architecture Technique",
        target: "Lead Developer",
        location: "Espace Dev - Open Space",
        objective: "Comprendre notre stack technologique",
        description: "Échangez avec notre Lead Developer sur les technologies que nous utilisons pour créer un impact social."
      },
      {
        id: 3,
        day: 3,
        title: "Écosystème Partenarial",
        target: "Responsable Partenariats",
        location: "Salle de Réunion Innovation",
        objective: "Découvrir notre réseau d'impact",
        description: "Apprenez comment nous collaborons avec des organisations pour maximiser notre impact social."
      },
      {
        id: 4,
        day: 4,
        title: "Excellence Produit",
        target: "Product Manager",
        location: "Zone Product - Étage 1",
        objective: "Comprendre notre approche produit",
        description: "Découvrez comment nous concevons des produits qui résolvent de vrais problèmes sociaux."
      },
      {
        id: 5,
        day: 5,
        title: "Communication Impactante",
        target: "Responsable Communication",
        location: "Studio Média",
        objective: "Maîtriser notre storytelling",
        description: "Apprenez à raconter des histoires qui mobilisent pour le changement social."
      },
      {
        id: 6,
        day: 6,
        title: "Excellence Opérationnelle",
        target: "Responsable Opérations",
        location: "Centre Opérationnel",
        objective: "Optimiser nos processus",
        description: "Découvrez comment nous garantissons l'efficacité de nos opérations pour maximiser l'impact."
      },
      {
        id: 7,
        day: 7,
        title: "Croissance Durable",
        target: "Responsable Développement",
        location: "Salle Stratégie",
        objective: "Planifier notre expansion",
        description: "Participez à la définition de notre stratégie de croissance responsable et durable."
      }
    ])

    const currentMission = computed(() => {
      return missions.value.find(m => m.id === currentMissionId.value && !completedMissions.value.includes(m.id))
    })

    const completeMission = () => {
      if (currentMission.value) {
        completedMissions.value.push(currentMission.value.id)
        showCongratulations.value = true
        
        // Passer à la mission suivante
        currentMissionId.value += 1
      }
    }

    onMounted(() => {
      console.log('EscapeGame component mounted')
    })

    return {
      missions,
      currentMission,
      currentMissionId,
      completedMissions,
      showCongratulations,
      completeMission
    }
  }
}
</script>

<style scoped>
.onboarding-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header moderne et épuré */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.progress-indicator {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1d4ed8, #6d28d9);
  border-radius: 50px;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

/* Card mission moderne */
.current-mission-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 3rem;
  position: relative;
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.mission-day {
  background: #1d4ed8;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

.mission-status {
  background: #fbbf24;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mission-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.mission-description {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.mission-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Section action simple et claire */
.action-section {
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #1d4ed8;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #374151;
}

.action-description {
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #1d4ed8;
  line-height: 1.6;
}

.completion-section {
  margin-top: 1rem;
}

.complete-mission-btn {
  font-weight: 600;
}

/* Card de completion */
.completion-card {
  background: white;
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.completion-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.completion-card h2 {
  color: #1e293b;
  margin-bottom: 1rem;
}

.completion-card p {
  color: #64748b;
  margin-bottom: 0.5rem;
}

/* Vue d'ensemble moderne */
.missions-overview {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.missions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mission-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.mission-item.current {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.mission-item.completed {
  border-color: #047857;
  background: #f0fdf4;
}

.mission-item.upcoming {
  opacity: 0.6;
}

.mission-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #475569;
  margin-right: 1rem;
  flex-shrink: 0;
}

.mission-item.current .mission-number {
  background: #1d4ed8;
  color: white;
}

.mission-item.completed .mission-number {
  background: #047857;
  color: white;
}

.mission-content {
  flex: 1;
}

.mission-content h4 {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.mission-content p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.mission-icon {
  margin-left: 1rem;
}

/* Dialog moderne */
.celebration-card {
  border-radius: 16px;
  overflow: hidden;
}

.celebration-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-container {
    padding: 1rem 0.5rem;
  }
  
  .current-mission-card {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .mission-title {
    font-size: 1.5rem;
  }
  
  .answer-section {
    flex-direction: column;
  }
  
  .mission-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>