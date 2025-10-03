<template>
  <v-container fluid class="office-tour-page pa-0">
    <!-- Header avec progression -->
    <v-card class="tour-header" elevation="4">
      <v-card-text class="pa-6">
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6">
            <h1 class="text-h3 mb-2">
              <v-icon size="48" color="primary" class="mr-3">mdi-office-building</v-icon>
              Visite Virtuelle Tech4Good
            </h1>
            <p class="text-h6 text-medium-emphasis mb-0">
              Découvrez votre nouveau lieu de travail et rencontrez vos collègues
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <div class="tour-stats">
              <v-chip color="primary" size="large" class="ma-1">
                <v-icon start>mdi-map-marker</v-icon>
                {{ visitedPoles }}/{{ totalPoles }} pôles visités
              </v-chip>
              <v-chip color="success" size="large" class="ma-1">
                <v-icon start>mdi-account-group</v-icon>
                {{ metColleagues }} collègues rencontrés
              </v-chip>
            </div>
          </v-col>
        </v-row>
        
        <!-- Barre de progression globale -->
        <v-progress-linear
          :model-value="globalProgress"
          color="primary"
          height="8"
          rounded
          class="mt-4"
        ></v-progress-linear>
        <div class="text-center mt-2">
          <small class="text-medium-emphasis">Progression de la visite : {{ Math.round(globalProgress) }}%</small>
        </div>
      </v-card-text>
    </v-card>

    <!-- Plan interactif des bureaux -->
    <v-card class="office-map ma-4" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-map</v-icon>
        Plan Interactif des Bureaux Tech4Good
      </v-card-title>
      <v-card-text>
        <div class="office-grid">
          <div
            v-for="pole in officeLayout"
            :key="pole.id"
            :class="['office-zone', pole.status]"
            @click="visitPole(pole)"
          >
            <div class="zone-icon">
              <v-icon :color="getZoneColor(pole.status)" size="32">{{ pole.icon }}</v-icon>
            </div>
            <h4 class="zone-title">{{ pole.name }}</h4>
            <p class="zone-description">{{ pole.shortDescription }}</p>
            <div class="zone-status">
              <v-chip
                :color="getZoneColor(pole.status)"
                size="small"
                variant="tonal"
              >
                {{ getStatusText(pole.status) }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Pôle actuellement visité -->
    <v-card v-if="currentPole" class="current-visit ma-4" elevation="4">
      <v-card-title class="pole-header" :style="{ backgroundColor: currentPole.color }">
        <v-row align="center" no-gutters>
          <v-col>
            <v-icon size="40" color="white" class="mr-3">{{ currentPole.icon }}</v-icon>
            <span class="text-h4 text-white">{{ currentPole.name }}</span>
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon="mdi-close"
              color="white"
              variant="text"
              @click="currentPole = null"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="8">
            <h3 class="text-h5 mb-3">{{ currentPole.longDescription }}</h3>
            <p class="text-body-1 mb-4">{{ currentPole.mission }}</p>
            
            <!-- Équipe du pôle -->
            <h4 class="text-h6 mb-3">
              <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
              Équipe ({{ currentPole.team.length }} personnes)
            </h4>
            <v-row>
              <v-col
                v-for="member in currentPole.team"
                :key="member.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="team-member" elevation="1" hover>
                  <v-card-text class="text-center pa-4">
                    <v-avatar size="60" :color="member.avatarColor" class="mb-2">
                      <span class="text-h6 text-white">{{ member.initials }}</span>
                    </v-avatar>
                    <h5 class="text-subtitle1 font-weight-bold">{{ member.name }}</h5>
                    <p class="text-body-2 text-medium-emphasis">{{ member.role }}</p>
                    <v-btn
                      v-if="!member.met"
                      size="small"
                      color="primary"
                      @click="meetColleague(member)"
                    >
                      Se présenter
                    </v-btn>
                    <v-chip v-else color="success" size="small">
                      <v-icon start size="small">mdi-check</v-icon>
                      Rencontré
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="pole-info" color="surface-variant" elevation="0">
              <v-card-text>
                <h4 class="text-h6 mb-3">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Informations Pratiques
                </h4>
                <v-list density="compact">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-title>{{ currentPole.location }}</v-list-item-title>
                    <v-list-item-subtitle>Localisation</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-clock</v-icon>
                    </template>
                    <v-list-item-title>{{ currentPole.schedule }}</v-list-item-title>
                    <v-list-item-subtitle>Horaires d'activité</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-tools</v-icon>
                    </template>
                    <v-list-item-title>{{ currentPole.tools.join(', ') }}</v-list-item-title>
                    <v-list-item-subtitle>Outils utilisés</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                
                <v-btn
                  v-if="currentPole.status !== 'completed'"
                  block
                  color="primary"
                  class="mt-4"
                  @click="completePoleVisit(currentPole)"
                >
                  <v-icon start>mdi-check</v-icon>
                  Terminer la visite
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Achievements débloqués -->
    <v-card v-if="achievements.length > 0" class="achievements ma-4" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="warning">mdi-trophy</v-icon>
        Accomplissements Débloqués
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="achievement in achievements"
            :key="achievement.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card color="warning" variant="tonal" elevation="1">
              <v-card-text class="text-center pa-4">
                <v-icon size="40" color="warning" class="mb-2">{{ achievement.icon }}</v-icon>
                <h5 class="text-subtitle1 font-weight-bold">{{ achievement.name }}</h5>
                <p class="text-body-2">{{ achievement.description }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// État de la visite
const currentPole = ref(null)
const achievements = ref([])

// Données des pôles de l'entreprise
const officeLayout = ref([
  {
    id: 'direction',
    name: 'Direction Générale',
    icon: 'mdi-account-tie',
    color: '#1976D2',
    shortDescription: 'Pilotage stratégique et vision',
    longDescription: 'Le pôle Direction définit la stratégie de Tech4Good et orchestre la transformation numérique du secteur associatif.',
    mission: 'Définir la vision stratégique, piloter les partenariats et assurer le développement de l\'écosystème Tech4Good.',
    location: 'Bureau 201 - 2ème étage',
    schedule: '9h-18h du lundi au vendredi',
    tools: ['Strategic Planning', 'Partnership Management', 'Budget Control'],
    status: 'available',
    team: [
      {
        id: 1,
        name: 'Marie Dupont',
        role: 'Directrice Générale',
        initials: 'MD',
        avatarColor: '#1976D2',
        met: false
      },
      {
        id: 2,
        name: 'Thomas Martin',
        role: 'Directeur Adjoint',
        initials: 'TM',
        avatarColor: '#388E3C',
        met: false
      }
    ]
  },
  {
    id: 'dev',
    name: 'Développement',
    icon: 'mdi-code-tags',
    color: '#388E3C',
    shortDescription: 'Solutions techniques innovantes',
    longDescription: 'L\'équipe de développement crée les solutions numériques qui transforment le quotidien des associations.',
    mission: 'Concevoir, développer et maintenir les applications web et mobiles pour les associations partenaires.',
    location: 'Open Space A - 1er étage',
    schedule: '9h-18h avec flexibilité',
    tools: ['Vue.js', 'Node.js', 'Python', 'Supabase', 'Git'],
    status: 'available',
    team: [
      {
        id: 3,
        name: 'Sophie Bernard',
        role: 'Lead Developer',
        initials: 'SB',
        avatarColor: '#388E3C',
        met: false
      },
      {
        id: 4,
        name: 'Lucas Moreau',
        role: 'Full Stack Developer',
        initials: 'LM',
        avatarColor: '#F57C00',
        met: false
      },
      {
        id: 5,
        name: 'Camille Petit',
        role: 'Frontend Developer',
        initials: 'CP',
        avatarColor: '#7B1FA2',
        met: false
      }
    ]
  },
  {
    id: 'design',
    name: 'Design & UX',
    icon: 'mdi-palette',
    color: '#7B1FA2',
    shortDescription: 'Expérience utilisateur optimale',
    longDescription: 'Le pôle Design & UX conçoit des interfaces intuitives et accessibles pour maximiser l\'impact social.',
    mission: 'Créer des expériences utilisateur exceptionnelles qui rendent la technologie accessible à tous.',
    location: 'Atelier Créatif - 1er étage',
    schedule: '9h30-18h30',
    tools: ['Figma', 'Adobe Creative Suite', 'Miro', 'Principle', 'UserTesting'],
    status: 'available',
    team: [
      {
        id: 6,
        name: 'Emma Rousseau',
        role: 'UX Designer',
        initials: 'ER',
        avatarColor: '#7B1FA2',
        met: false
      },
      {
        id: 7,
        name: 'Alex Durand',
        role: 'UI Designer',
        initials: 'AD',
        avatarColor: '#D32F2F',
        met: false
      }
    ]
  },
  {
    id: 'partenariats',
    name: 'Partenariats',
    icon: 'mdi-handshake',
    color: '#F57C00',
    shortDescription: 'Relations associations & entreprises',
    longDescription: 'Le pôle Partenariats développe et entretient les relations avec notre écosystème d\'associations et d\'entreprises.',
    mission: 'Identifier, développer et maintenir les partenariats stratégiques pour amplifier notre impact social.',
    location: 'Bureau 105 - Rez-de-chaussée',
    schedule: '8h30-17h30',
    tools: ['CRM Salesforce', 'LinkedIn Sales Navigator', 'Mailchimp', 'Zoom'],
    status: 'available',
    team: [
      {
        id: 8,
        name: 'Antoine Lefevre',
        role: 'Responsable Partenariats',
        initials: 'AL',
        avatarColor: '#F57C00',
        met: false
      },
      {
        id: 9,
        name: 'Julie Garnier',
        role: 'Chargée de Relations',
        initials: 'JG',
        avatarColor: '#00796B',
        met: false
      }
    ]
  },
  {
    id: 'formation',
    name: 'Formation',
    icon: 'mdi-school',
    color: '#00796B',
    shortDescription: 'Accompagnement et pédagogie',
    longDescription: 'Le pôle Formation développe les compétences numériques des équipes associatives à travers des programmes adaptés.',
    mission: 'Concevoir et animer des formations pour autonomiser les associations dans leur transformation numérique.',
    location: 'Salle de Formation - Rez-de-chaussée',
    schedule: '9h-17h selon les sessions',
    tools: ['LMS Moodle', 'Zoom', 'OBS Studio', 'Canva', 'Google Workspace'],
    status: 'available',
    team: [
      {
        id: 10,
        name: 'Pierre Lambert',
        role: 'Responsable Formation',
        initials: 'PL',
        avatarColor: '#00796B',
        met: false
      },
      {
        id: 11,
        name: 'Clara Dubois',
        role: 'Formatrice Senior',
        initials: 'CD',
        avatarColor: '#1976D2',
        met: false
      }
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: 'mdi-bullhorn',
    color: '#D32F2F',
    shortDescription: 'Rayonnement et engagement',
    longDescription: 'Le pôle Communication amplifie la visibilité de Tech4Good et engage la communauté autour de nos valeurs.',
    mission: 'Développer la notoriété de Tech4Good et sensibiliser aux enjeux de la transformation numérique du secteur associatif.',
    location: 'Bureau 102 - Rez-de-chaussée',
    schedule: '9h-18h avec événements soirs',
    tools: ['Social Media', 'WordPress', 'Canva', 'Buffer', 'Google Analytics'],
    status: 'available',
    team: [
      {
        id: 12,
        name: 'Manon Roux',
        role: 'Responsable Communication',
        initials: 'MR',
        avatarColor: '#D32F2F',
        met: false
      },
      {
        id: 13,
        name: 'Hugo Silva',
        role: 'Community Manager',
        initials: 'HS',
        avatarColor: '#7B1FA2',
        met: false
      }
    ]
  }
])

// Calculs de progression
const totalPoles = computed(() => officeLayout.value.length)
const visitedPoles = computed(() => officeLayout.value.filter(pole => pole.status === 'completed').length)
const globalProgress = computed(() => (visitedPoles.value / totalPoles.value) * 100)
const metColleagues = computed(() => {
  return officeLayout.value.reduce((total, pole) => {
    return total + pole.team.filter(member => member.met).length
  }, 0)
})

// Méthodes utilitaires
const getZoneColor = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'visiting': return 'primary'
    case 'available': return 'info'
    default: return 'grey'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Visité'
    case 'visiting': return 'En cours'
    case 'available': return 'Disponible'
    default: return 'Verrouillé'
  }
}

// Actions principales
const visitPole = (pole) => {
  if (pole.status === 'available' || pole.status === 'completed') {
    pole.status = 'visiting'
    currentPole.value = pole
    console.log(`Visite du pôle : ${pole.name}`)
  }
}

const meetColleague = (member) => {
  member.met = true
  console.log(`Rencontre avec ${member.name} - ${member.role}`)
  
  // Débloque des achievements selon le nombre de collègues rencontrés
  const totalMet = metColleagues.value
  if (totalMet === 1 && !achievements.value.find(a => a.id === 'first-meeting')) {
    achievements.value.push({
      id: 'first-meeting',
      name: 'Première Rencontre',
      description: 'Vous avez rencontré votre premier collègue !',
      icon: 'mdi-account-plus'
    })
  }
  
  if (totalMet === 5 && !achievements.value.find(a => a.id === 'social-butterfly')) {
    achievements.value.push({
      id: 'social-butterfly',
      name: 'Papillon Social',
      description: 'Vous avez rencontré 5 collègues !',
      icon: 'mdi-account-group'
    })
  }
  
  if (totalMet === 10 && !achievements.value.find(a => a.id === 'network-master')) {
    achievements.value.push({
      id: 'network-master',
      name: 'Maître du Réseau',
      description: 'Vous connaissez maintenant la moitié de l\'équipe !',
      icon: 'mdi-network'
    })
  }
}

const completePoleVisit = (pole) => {
  pole.status = 'completed'
  currentPole.value = null
  console.log(`Visite du pôle ${pole.name} terminée`)
  
  // Débloque des achievements selon le nombre de pôles visités
  const visited = visitedPoles.value
  if (visited === 1 && !achievements.value.find(a => a.id === 'first-visit')) {
    achievements.value.push({
      id: 'first-visit',
      name: 'Premier Pas',
      description: 'Vous avez visité votre premier pôle !',
      icon: 'mdi-footsteps'
    })
  }
  
  if (visited === 3 && !achievements.value.find(a => a.id === 'explorer')) {
    achievements.value.push({
      id: 'explorer',
      name: 'Explorateur',
      description: 'Vous avez exploré la moitié des pôles !',
      icon: 'mdi-compass'
    })
  }
  
  if (visited === totalPoles.value && !achievements.value.find(a => a.id === 'office-master')) {
    achievements.value.push({
      id: 'office-master',
      name: 'Maître des Lieux',
      description: 'Vous avez visité tous les pôles de Tech4Good !',
      icon: 'mdi-trophy'
    })
  }
}

onMounted(() => {
  console.log('Visite virtuelle Tech4Good initialisée')
  console.log(`${totalPoles.value} pôles disponibles à la visite`)
})
</script>

<style scoped>
.office-tour-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.tour-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 0;
}

.tour-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.office-map {
  background: white;
}

.office-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.office-zone {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.office-zone:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #1976D2;
}

.office-zone.completed {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
}

.office-zone.visiting {
  border-color: #1976D2;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
}

.zone-icon {
  margin-bottom: 12px;
}

.zone-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.zone-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.zone-status {
  margin-top: auto;
}

.current-visit {
  background: white;
}

.pole-header {
  position: relative;
  overflow: hidden;
}

.pole-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

.team-member {
  transition: transform 0.2s ease;
}

.team-member:hover {
  transform: scale(1.02);
}

.pole-info {
  height: fit-content;
  position: sticky;
  top: 20px;
}

.achievements {
  background: white;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .office-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .tour-stats {
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
