<template>
  <div class="profile-page">
    <v-container fluid class="py-6">
      <!-- Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-6" elevation="2">
            <div class="d-flex align-center mb-4">
              <v-avatar size="80" class="mr-6" color="primary">
                <span class="text-h4 font-weight-bold text-white">{{ userInitials }}</span>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-2">{{ fullName }}</h1>
                <p class="text-body-1 text-medium-emphasis mb-1">{{ userRole }}</p>
                <p class="text-body-2 text-medium-emphasis">{{ userEmail }} • Membre depuis {{ joinDate }}</p>
              </div>
            </div>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h3 class="text-h6 mb-3">Progression de l'intégration</h3>
                  <v-progress-linear
                    :model-value="progressionValue"
                    color="primary"
                    height="12"
                    rounded
                    class="mb-2"
                  ></v-progress-linear>
                  <p class="text-body-2 text-center">{{ progressionValue }}% complété</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h3 class="text-h6 mb-3">Prochaine étape</h3>
                  <div class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-calendar-check</v-icon>
                    <div>
                      <p class="font-weight-medium mb-0">Session mentor avec Sarah</p>
                      <p class="text-body-2 text-medium-emphasis">Demain 14h30</p>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Informations personnelles -->
        <v-col cols="12" lg="6">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-account-edit</v-icon>
              Informations personnelles
            </v-card-title>
            <v-card-text>
              <v-form ref="profileForm" v-model="isProfileValid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editableProfile.firstName"
                      label="Prénom"
                      variant="outlined"
                      :rules="nameRules"
                      prepend-inner-icon="mdi-account"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editableProfile.lastName"
                      label="Nom"
                      variant="outlined"
                      :rules="nameRules"
                      prepend-inner-icon="mdi-account"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editableProfile.email"
                      label="Email"
                      variant="outlined"
                      :rules="emailRules"
                      prepend-inner-icon="mdi-email"
                      readonly
                      hint="L'email ne peut pas être modifié"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="editableProfile.role"
                      label="Rôle"
                      :items="roleOptions"
                      variant="outlined"
                      prepend-inner-icon="mdi-badge-account"
                    ></v-select>
                  </v-col>
                </v-row>
                
                <div class="d-flex justify-end mt-4">
                  <v-btn
                    color="primary"
                    @click="saveProfile"
                    :loading="isSaving"
                    :disabled="!isProfileValid || !hasProfileChanges"
                  >
                    <v-icon start>mdi-content-save</v-icon>
                    Sauvegarder
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Paramètres personnels -->
        <v-col cols="12" lg="6">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
              Paramètres personnels
            </v-card-title>
            <v-card-text>
              <!-- Dark/Light Mode Toggle -->
              <div class="d-flex align-center justify-space-between py-3">
                <div class="d-flex align-center">
                  <v-icon :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" class="mr-3"></v-icon>
                  <div>
                    <p class="font-weight-medium mb-1">Mode sombre</p>
                    <p class="text-body-2 text-medium-emphasis mb-0">Basculer entre thème clair et sombre</p>
                  </div>
                </div>
                <v-switch
                  v-model="isDark"
                  @update:model-value="toggleTheme"
                  color="primary"
                  hide-details
                ></v-switch>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Notifications -->
              <div class="d-flex align-center justify-space-between py-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-bell" class="mr-3"></v-icon>
                  <div>
                    <p class="font-weight-medium mb-1">Notifications push</p>
                    <p class="text-body-2 text-medium-emphasis mb-0">Recevoir des notifications pour les événements</p>
                  </div>
                </div>
                <v-switch
                  v-model="notifications"
                  color="primary"
                  hide-details
                ></v-switch>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Tour guidé -->
              <div class="d-flex align-center justify-space-between py-3">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-compass-outline" class="mr-3"></v-icon>
                  <div>
                    <p class="font-weight-medium mb-1">Refaire le tour guidé</p>
                    <p class="text-body-2 text-medium-emphasis mb-0">Découvrir à nouveau les fonctionnalités</p>
                  </div>
                </div>
                <v-btn 
                  color="primary" 
                  variant="outlined"
                  @click="startGuidedTour"
                  size="small"
                >
                  Démarrer
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Informations personnelles -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="secondary">mdi-account-edit</v-icon>
              Informations personnelles
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="userInfo.firstName"
                    label="Prénom"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="userInfo.lastName"
                    label="Nom"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="userInfo.email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="userInfo.phone"
                    label="Téléphone"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="userInfo.department"
                    :items="departments"
                    label="Département"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>
              <v-btn color="primary" class="mt-3">
                Sauvegarder les modifications
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Mon mentorat -->
        <v-col cols="12" lg="6">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="accent">mdi-account-heart</v-icon>
              Mon mentorat
            </v-card-title>
            <v-card-text>
              <!-- Mentor actuel -->
              <div v-if="currentMentor" class="mb-4">
                <h3 class="text-h6 mb-3">Votre mentor</h3>
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <v-avatar size="48" class="mr-3" color="secondary">
                      <span class="text-h6 font-weight-bold text-white">SM</span>
                    </v-avatar>
                    <div>
                      <p class="font-weight-bold mb-1">{{ currentMentor.name }}</p>
                      <p class="text-body-2 text-medium-emphasis mb-0">{{ currentMentor.role }}</p>
                    </div>
                    <v-spacer></v-spacer>
                    <v-chip color="success" size="small">
                      <v-icon start>mdi-check-circle</v-icon>
                      Connecté
                    </v-chip>
                  </div>
                  <p class="text-body-2 mb-3">{{ currentMentor.bio }}</p>
                  <div class="d-flex gap-2">
                    <v-btn color="primary" variant="outlined" size="small">
                      <v-icon start>mdi-message</v-icon>
                      Contacter
                    </v-btn>
                    <v-btn color="secondary" variant="outlined" size="small">
                      <v-icon start>mdi-calendar</v-icon>
                      Planifier RDV
                    </v-btn>
                  </div>
                </v-card>
              </div>

              <!-- Feedback 360° -->
              <div class="mb-4">
                <h3 class="text-h6 mb-3">Feedback 360°</h3>
                <v-card variant="outlined" class="pa-4">
                  <p class="text-body-2 mb-3">Partagez vos retours et recevez des conseils personnalisés</p>
                  <div class="d-flex gap-2">
                    <v-btn color="primary" variant="outlined" size="small">
                      <v-icon start>mdi-star</v-icon>
                      Donner feedback
                    </v-btn>
                    <v-btn color="secondary" variant="outlined" size="small">
                      <v-icon start>mdi-chart-line</v-icon>
                      Voir mes retours
                    </v-btn>
                  </div>
                </v-card>
              </div>

              <!-- Sessions de partage -->
              <div>
                <h3 class="text-h6 mb-3">Sessions de partage</h3>
                <v-list density="compact">
                  <v-list-item
                    v-for="session in skillSessions"
                    :key="session.id"
                    class="mb-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="32" :color="session.color">
                        <v-icon :icon="session.icon" color="white"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ session.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ session.date }} • {{ session.participants }} participants</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-btn :color="session.status === 'joined' ? 'success' : 'primary'" variant="outlined" size="small">
                        {{ session.status === 'joined' ? 'Inscrit' : 'Rejoindre' }}
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>

          <!-- Statistiques -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-chart-box</v-icon>
              Vos statistiques
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label">
                  <div class="text-center">
                    <v-icon :icon="stat.icon" :color="stat.color" size="32" class="mb-2"></v-icon>
                    <p class="text-h6 font-weight-bold mb-1">{{ stat.value }}</p>
                    <p class="text-body-2 text-medium-emphasis">{{ stat.label }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Tour guidé component -->
    <GuidedTour 
      ref="guidedTour" 
      v-model="showGuidedTour"
      @tour-completed="onTourCompleted"
    />

    <!-- Snackbar pour les notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useTheme } from 'vuetify'
import GuidedTour from './GuidedTour.vue'
import { useUser } from '../composables/useUser.js'

const theme = useTheme()

// Reactive data
const progressionValue = ref(42)
const notifications = ref(true)
const showGuidedTour = ref(false)
const guidedTour = ref(null)

// Utiliser le composable centralisé pour l'utilisateur
const { fullName, userInitials, userRole, userEmail, joinDate, firstName, lastName, updateUser, loadUser } = useUser()

// État de l'édition du profil
const isProfileValid = ref(false)
const isSaving = ref(false)
const editableProfile = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
})

// Options pour le rôle
const roleOptions = [
  'Nouvel arrivant',
  'Manager',
  'RH'
]

// Règles de validation
const nameRules = [
  v => !!v || 'Ce champ est requis',
  v => v.length >= 2 || 'Minimum 2 caractères'
]

const emailRules = [
  v => !!v || 'Email requis',
  v => /.+@.+\..+/.test(v) || 'Email invalide'
]

// Watcher pour mettre à jour le profil éditable quand les données utilisateur changent
watch([firstName, lastName, userEmail, userRole], () => {
  editableProfile.value = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: userEmail.value,
    role: userRole.value
  }
}, { immediate: true })

// Computed pour vérifier s'il y a des changements
const hasProfileChanges = computed(() => {
  return editableProfile.value.firstName !== firstName.value ||
         editableProfile.value.lastName !== lastName.value ||
         editableProfile.value.role !== userRole.value
})

// Fonction pour sauvegarder le profil
const saveProfile = async () => {
  if (!isProfileValid.value) return

  isSaving.value = true
  try {
    await updateUser({
      first_name: editableProfile.value.firstName,
      last_name: editableProfile.value.lastName,
      role: editableProfile.value.role
    })
    
    // Afficher un message de succès
    showNotification('Profil mis à jour avec succès !', 'success')
    
    // Recharger les données utilisateur
    await loadUser()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showNotification('Erreur lors de la sauvegarde du profil', 'error')
  } finally {
    isSaving.value = false
  }
}

// Gestion des notifications
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const showNotification = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Theme management
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: (value) => {
    theme.global.name.value = value ? 'dark' : 'light'
    localStorage.setItem('tech4good-theme', value ? 'dark' : 'light')
  }
})

// User info
const userInfo = ref({
  firstName: 'Alexis',
  lastName: 'Martin',
  email: 'alexis.martin@tech4good.fr',
  phone: '+33 6 12 34 56 78',
  department: 'Développement Frontend'
})

const departments = [
  'Développement Frontend',
  'Développement Backend',
  'UX/UI Design',
  'Marketing Digital',
  'Chef de Projet',
  'Data Science',
  'DevOps',
  'Ressources Humaines'
]

// Mentor data
const currentMentor = ref({
  name: 'Sarah Martin',
  role: 'Senior Marketing Manager',
  avatar: './personalpicture.png',
  bio: 'Experte en marketing digital avec 8 ans d\'expérience. Passionnée par l\'accompagnement des nouveaux talents.'
})

// Skill sharing sessions
const skillSessions = ref([
  {
    id: 1,
    title: 'Vue.js pour débutants',
    date: '5 octobre 14h',
    participants: 8,
    icon: 'mdi-vuejs',
    color: 'success',
    status: 'joined'
  },
  {
    id: 2,
    title: 'Design System & Composants',
    date: '12 octobre 16h',
    participants: 12,
    icon: 'mdi-palette',
    color: 'primary',
    status: 'available'
  },
  {
    id: 3,
    title: 'Méthodes Agiles en pratique',
    date: '18 octobre 10h',
    participants: 15,
    icon: 'mdi-rocket',
    color: 'warning',
    status: 'available'
  }
])

// Statistics
const stats = ref([
  { label: 'Formations', value: '5/8', icon: 'mdi-school', color: 'primary' },
  { label: 'Quiz réussis', value: '12', icon: 'mdi-trophy', color: 'success' },
  { label: 'Sessions mentor', value: '3', icon: 'mdi-account-heart', color: 'accent' },
  { label: 'Jours restants', value: '127', icon: 'mdi-calendar', color: 'warning' }
])

// Methods
const toggleTheme = () => {
  // Theme is automatically updated via computed property
}

const startGuidedTour = () => {
  if (guidedTour.value) {
    guidedTour.value.startTour()
  }
}

const onTourCompleted = () => {
  // Handle tour completion
  console.log('Tour guidé terminé!')
}

// Load theme preference on mount
const savedTheme = localStorage.getItem('tech4good-theme')
if (savedTheme) {
  theme.global.name.value = savedTheme
}
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 80px);
}
</style>