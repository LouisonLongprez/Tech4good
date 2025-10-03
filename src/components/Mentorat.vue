<template>
  <div class="mentorat-page">
    <v-container fluid class="py-6">
      <!-- Header avec matching IA -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-6" elevation="2" color="primary" variant="flat">
            <div class="text-center text-white mb-4">
              <v-icon size="48" class="mb-3">mdi-account-heart</v-icon>
              <h1 class="text-h3 font-weight-bold mb-2">Mentorat Tech4Good</h1>
              <p class="text-h6 font-weight-light">Matching intelligent basé sur l'IA pour un mentorat personnalisé</p>
            </div>
            
            <v-row align="center" justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-card class="pa-4">
                  <div class="text-center mb-3">
                    <v-icon color="primary" size="32" class="mb-2">mdi-brain</v-icon>
                    <h3 class="text-h6 font-weight-bold">Analyse IA en cours...</h3>
                  </div>
                  <v-progress-linear
                    :model-value="matchingProgress"
                    color="primary"
                    height="8"
                    rounded
                    striped
                    class="mb-3"
                  ></v-progress-linear>
                  <p class="text-center text-body-2 text-medium-emphasis">
                    Analyse de votre profil : {{ matchingSteps[currentMatchingStep] }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Mon mentor actuel -->
        <v-col cols="12" lg="4">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="success">mdi-account-check</v-icon>
              Mon mentor actuel
            </v-card-title>
            <v-card-text>
              <div v-if="currentMentor" class="text-center">
                <v-avatar size="80" class="mb-3" color="success">
                  <span class="text-h5 font-weight-bold text-white">SM</span>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-1">{{ currentMentor.name }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-3">{{ currentMentor.role }}</p>
                
                <!-- Compatibilité -->
                <v-card variant="outlined" class="pa-3 mb-3">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="font-weight-medium">Compatibilité IA</span>
                    <v-chip color="success" size="small">{{ currentMentor.compatibility }}%</v-chip>
                  </div>
                  <v-progress-linear
                    :model-value="currentMentor.compatibility"
                    color="success"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </v-card>

                <p class="text-body-2 mb-4">{{ currentMentor.bio }}</p>
                
                <!-- Prochaine session -->
                <v-alert type="info" variant="tonal" class="mb-3">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                    <div>
                      <p class="font-weight-medium mb-0">Prochain RDV</p>
                      <p class="text-body-2 mb-0">{{ currentMentor.nextMeeting }}</p>
                    </div>
                  </div>
                </v-alert>

                <div class="d-flex gap-2">
                  <v-btn color="primary" variant="flat" block>
                    <v-icon start>mdi-message</v-icon>
                    Contacter
                  </v-btn>
                  <v-btn color="secondary" variant="outlined" block>
                    <v-icon start>mdi-calendar-plus</v-icon>
                    Planifier
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Mentors suggérés par l'IA -->
        <v-col cols="12" lg="8">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-robot</v-icon>
                Mentors suggérés par l'IA
              </div>
              <v-btn color="primary" variant="outlined" size="small" @click="refreshSuggestions">
                <v-icon start>mdi-refresh</v-icon>
                Actualiser
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col 
                  cols="12" 
                  md="6" 
                  v-for="mentor in suggestedMentors" 
                  :key="mentor.id"
                >
                  <v-card variant="outlined" class="h-100">
                    <v-card-text class="text-center pa-4">
                      <v-avatar size="64" class="mb-3" :color="mentor.color">
                        <span class="text-h6 font-weight-bold text-white">{{ mentor.initials }}</span>
                      </v-avatar>
                      
                      <h4 class="font-weight-bold mb-1">{{ mentor.name }}</h4>
                      <p class="text-body-2 text-medium-emphasis mb-3">{{ mentor.role }}</p>
                      
                      <!-- Score de matching -->
                      <div class="mb-3">
                        <div class="d-flex align-center justify-space-between mb-1">
                          <span class="text-body-2">Match IA</span>
                          <v-chip :color="getMatchColor(mentor.match)" size="small">
                            {{ mentor.match }}%
                          </v-chip>
                        </div>
                        <v-progress-linear
                          :model-value="mentor.match"
                          :color="getMatchColor(mentor.match)"
                          height="4"
                          rounded
                        ></v-progress-linear>
                      </div>

                      <!-- Compétences communes -->
                      <div class="mb-3">
                        <p class="text-body-2 font-weight-medium mb-2">Compétences communes</p>
                        <div class="d-flex flex-wrap gap-1 justify-center">
                          <v-chip 
                            v-for="skill in mentor.commonSkills" 
                            :key="skill"
                            size="x-small"
                            color="primary"
                            variant="outlined"
                          >
                            {{ skill }}
                          </v-chip>
                        </div>
                      </div>

                      <!-- Raisons du match -->
                      <v-alert type="info" variant="tonal" density="compact" class="mb-3">
                        <p class="text-body-2 mb-0">{{ mentor.matchReason }}</p>
                      </v-alert>

                      <div class="d-flex gap-2">
                        <v-btn 
                          color="primary" 
                          variant="flat" 
                          size="small" 
                          block
                          @click="connectMentor(mentor)"
                        >
                          Se connecter
                        </v-btn>
                        <v-btn 
                          color="secondary" 
                          variant="outlined" 
                          size="small"
                          icon
                          @click="viewProfile(mentor)"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sessions de partage entre générations -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="accent">mdi-account-group</v-icon>
              Sessions de partage intergénérationnelles
            </v-card-title>
            <v-card-subtitle>
              Échangez vos compétences et apprenez des autres générations
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col 
                  cols="12" 
                  md="6" 
                  lg="4" 
                  v-for="session in skillSharingSessions" 
                  :key="session.id"
                >
                  <v-card variant="outlined" class="h-100">
                    <v-card-text>
                      <div class="d-flex align-start mb-3">
                        <v-avatar :color="session.color" class="mr-3">
                          <v-icon :icon="session.icon" color="white"></v-icon>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <h4 class="font-weight-bold mb-1">{{ session.title }}</h4>
                          <p class="text-body-2 text-medium-emphasis mb-2">{{ session.type }}</p>
                        </div>
                        <v-chip 
                          :color="session.difficulty === 'Débutant' ? 'success' : session.difficulty === 'Intermédiaire' ? 'warning' : 'error'"
                          size="small"
                          variant="outlined"
                        >
                          {{ session.difficulty }}
                        </v-chip>
                      </div>

                      <p class="text-body-2 mb-3">{{ session.description }}</p>

                      <!-- Détails de la session -->
                      <div class="mb-3">
                        <div class="d-flex align-center mb-1">
                          <v-icon size="16" class="mr-2">mdi-calendar</v-icon>
                          <span class="text-body-2">{{ session.date }}</span>
                        </div>
                        <div class="d-flex align-center mb-1">
                          <v-icon size="16" class="mr-2">mdi-account-multiple</v-icon>
                          <span class="text-body-2">{{ session.participants }} participants</span>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="16" class="mr-2">mdi-account</v-icon>
                          <span class="text-body-2">Animé par {{ session.facilitator }}</span>
                        </div>
                      </div>

                      <!-- Participants par génération -->
                      <div class="mb-3">
                        <p class="text-body-2 font-weight-medium mb-2">Mix générationnel</p>
                        <div class="d-flex gap-1">
                          <v-chip size="x-small" color="primary" variant="outlined">
                            {{ session.generations.junior }} Junior
                          </v-chip>
                          <v-chip size="x-small" color="secondary" variant="outlined">
                            {{ session.generations.senior }} Senior
                          </v-chip>
                        </div>
                      </div>

                      <v-btn 
                        :color="session.registered ? 'success' : 'primary'"
                        :variant="session.registered ? 'outlined' : 'flat'"
                        block
                        @click="toggleRegistration(session)"
                      >
                        <v-icon start>
                          {{ session.registered ? 'mdi-check-circle' : 'mdi-plus-circle' }}
                        </v-icon>
                        {{ session.registered ? 'Inscrit' : 'Rejoindre' }}
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Feedback 360° -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-star-circle</v-icon>
              Feedback 360° - Système d'évaluation croisée
            </v-card-title>
            <v-card-text>
              <v-row>
                <!-- Donner du feedback -->
                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="h-100 pa-4">
                    <div class="text-center">
                      <v-icon size="48" color="primary" class="mb-3">mdi-comment-edit</v-icon>
                      <h3 class="text-h6 font-weight-bold mb-3">Donner du feedback</h3>
                      <p class="text-body-2 mb-4">Partagez vos retours sur vos interactions avec mentors et mentorés</p>
                      <v-btn color="primary" variant="flat" block>
                        <v-icon start>mdi-plus</v-icon>
                        Nouveau feedback
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>

                <!-- Recevoir du feedback -->
                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="h-100 pa-4">
                    <div class="text-center">
                      <v-icon size="48" color="success" class="mb-3">mdi-star</v-icon>
                      <h3 class="text-h6 font-weight-bold mb-3">Vos retours</h3>
                      <p class="text-body-2 mb-4">Consultez les feedbacks reçus et suivez votre progression</p>
                      
                      <!-- Moyenne des évaluations -->
                      <div class="mb-3">
                        <div class="d-flex align-center justify-center mb-2">
                          <v-rating
                            :model-value="averageRating"
                            color="warning"
                            half-increments
                            readonly
                            density="compact"
                          ></v-rating>
                          <span class="ml-2 font-weight-bold">{{ averageRating }}/5</span>
                        </div>
                        <p class="text-body-2 text-medium-emphasis">{{ totalFeedbacks }} évaluations reçues</p>
                      </div>

                      <v-btn color="success" variant="flat" block>
                        <v-icon start>mdi-chart-line</v-icon>
                        Voir les détails
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>

                <!-- Analytics -->
                <v-col cols="12" md="4">
                  <v-card variant="outlined" class="h-100 pa-4">
                    <div class="text-center">
                      <v-icon size="48" color="accent" class="mb-3">mdi-chart-donut</v-icon>
                      <h3 class="text-h6 font-weight-bold mb-3">Analytics</h3>
                      <p class="text-body-2 mb-4">Suivez l'impact de votre mentorat sur votre développement</p>
                      
                      <!-- Statistiques rapides -->
                      <div class="mb-3">
                        <div class="d-flex justify-space-between mb-1">
                          <span class="text-body-2">Compétences développées</span>
                          <span class="font-weight-bold">+7</span>
                        </div>
                        <div class="d-flex justify-space-between mb-1">
                          <span class="text-body-2">Sessions complétées</span>
                          <span class="font-weight-bold">12</span>
                        </div>
                        <div class="d-flex justify-space-between">
                          <span class="text-body-2">Progression globale</span>
                          <span class="font-weight-bold text-success">+24%</span>
                        </div>
                      </div>

                      <v-btn color="accent" variant="flat" block>
                        <v-icon start>mdi-file-chart</v-icon>
                        Rapport détaillé
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '../composables/useUser.js'

// Utiliser le composable centralisé pour l'utilisateur
const { fullName } = useUser()

// Reactive data
const matchingProgress = ref(0)
const currentMatchingStep = ref(0)

const matchingSteps = [
  'Analyse de votre profil et compétences',
  'Identification de vos objectifs d\'apprentissage',
  'Recherche de mentors compatibles',
  'Calcul des scores de compatibilité',
  'Finalisation des recommandations'
]

// Current mentor
const currentMentor = ref({
  name: 'Sarah Martin',
  role: 'Senior Marketing Manager',
  avatar: './personalpicture.png',
  bio: 'Experte en marketing digital avec 8 ans d\'expérience. Passionnée par l\'accompagnement des nouveaux talents.',
  compatibility: 92,
  nextMeeting: 'Demain 14h30 - Session de développement carrière'
})

// Suggested mentors by AI
const suggestedMentors = ref([
  {
    id: 1,
    name: 'Marc Dubois',
    role: 'Lead Developer Frontend',
    initials: 'MD',
    color: 'primary',
    match: 89,
    commonSkills: ['Vue.js', 'Design', 'UX'],
    matchReason: 'Expertise technique similaire et approche pédagogique compatible'
  },
  {
    id: 2,
    name: 'Julie Chen',
    role: 'Product Manager Senior',
    initials: 'JC',
    color: 'secondary',
    match: 84,
    commonSkills: ['Agile', 'Leadership', 'Innovation'],
    matchReason: 'Excellente pour développer vos compétences en gestion de produit'
  },
  {
    id: 3,
    name: 'Thomas Weber',
    role: 'DevOps Engineer',
    initials: 'TW',
    color: 'accent',
    match: 78,
    commonSkills: ['CI/CD', 'Cloud', 'Automatisation'],
    matchReason: 'Parfait pour élargir vos compétences techniques vers le DevOps'
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    role: 'UX Designer Lead',
    initials: 'ER',
    color: 'warning',
    match: 81,
    commonSkills: ['Design System', 'User Research', 'Figma'],
    matchReason: 'Idéale pour renforcer vos compétences en design et expérience utilisateur'
  }
])

// Skill sharing sessions
const skillSharingSessions = ref([
  {
    id: 1,
    title: 'Vue.js : Les bonnes pratiques',
    type: 'Reverse Mentoring',
    description: 'Session où les juniors partagent les dernières innovations Vue.js avec les seniors',
    date: '5 octobre 2025, 14h-16h',
    participants: 12,
    facilitator: fullName.value,
    icon: 'mdi-vuejs',
    color: 'success',
    difficulty: 'Intermédiaire',
    registered: true,
    generations: { junior: 6, senior: 6 }
  },
  {
    id: 2,
    title: 'Leadership stratégique',
    type: 'Mentoring traditionnel',
    description: 'Les seniors partagent leur expérience en leadership et prise de décision',
    date: '12 octobre 2025, 10h-12h',
    participants: 8,
    facilitator: 'Sarah Martin',
    icon: 'mdi-account-star',
    color: 'primary',
    difficulty: 'Avancé',
    registered: false,
    generations: { junior: 4, senior: 4 }
  },
  {
    id: 3,
    title: 'Design Systems modernes',
    type: 'Co-création',
    description: 'Création collaborative d\'un design system avec perspectives multi-générationnelles',
    date: '18 octobre 2025, 9h-17h',
    participants: 16,
    facilitator: 'Emma Rodriguez',
    icon: 'mdi-palette',
    color: 'accent',
    difficulty: 'Intermédiaire',
    registered: false,
    generations: { junior: 8, senior: 8 }
  },
  {
    id: 4,
    title: 'Intelligence Artificielle appliquée',
    type: 'Reverse Mentoring',
    description: 'Les digital natives expliquent l\'IA pratique aux générations précédentes',
    date: '25 octobre 2025, 14h-17h',
    participants: 10,
    facilitator: 'Marc Dubois',
    icon: 'mdi-robot',
    color: 'warning',
    difficulty: 'Débutant',
    registered: true,
    generations: { junior: 7, senior: 3 }
  },
  {
    id: 5,
    title: 'Gestion de projet agile',
    type: 'Mentoring traditionnel',
    description: 'Méthodologies éprouvées et adaptations modernes des méthodes agiles',
    date: '2 novembre 2025, 13h-16h',
    participants: 14,
    facilitator: 'Julie Chen',
    icon: 'mdi-rocket',
    color: 'secondary',
    difficulty: 'Intermédiaire',
    registered: false,
    generations: { junior: 7, senior: 7 }
  },
  {
    id: 6,
    title: 'Communication intergénérationnelle',
    type: 'Workshop collaboratif',
    description: 'Techniques de communication efficace entre différentes générations',
    date: '8 novembre 2025, 10h-12h',
    participants: 20,
    facilitator: 'Thomas Weber',
    icon: 'mdi-message-star',
    color: 'info',
    difficulty: 'Débutant',
    registered: false,
    generations: { junior: 10, senior: 10 }
  }
])

// Feedback 360° data
const averageRating = ref(4.3)
const totalFeedbacks = ref(18)

// Methods
const getMatchColor = (percentage) => {
  if (percentage >= 85) return 'success'
  if (percentage >= 70) return 'warning'
  return 'error'
}

const connectMentor = (mentor) => {
  console.log('Connexion avec le mentor:', mentor.name)
  // Implementation logic here
}

const viewProfile = (mentor) => {
  console.log('Voir le profil de:', mentor.name)
  // Implementation logic here
}

const refreshSuggestions = () => {
  console.log('Actualisation des suggestions IA')
  // Implementation logic here
}

const toggleRegistration = (session) => {
  session.registered = !session.registered
  if (session.registered) {
    session.participants += 1
  } else {
    session.participants -= 1
  }
}

// Simulate AI matching progress
onMounted(() => {
  const interval = setInterval(() => {
    if (matchingProgress.value < 100) {
      matchingProgress.value += 2
      if (matchingProgress.value % 20 === 0) {
        currentMatchingStep.value = Math.min(currentMatchingStep.value + 1, matchingSteps.length - 1)
      }
    } else {
      clearInterval(interval)
    }
  }, 100)
})
</script>

<style scoped>
.mentorat-page {
  min-height: calc(100vh - 80px);
}

.h-100 {
  height: 100%;
}
</style>