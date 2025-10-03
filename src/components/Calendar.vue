<template>
  <v-container fluid class="calendar-container">
    <!-- Header -->
    <v-row class="mb-8 mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar size="60" color="primary">
                  <span class="text-h5 font-weight-bold text-white">{{ userInitials }}</span>
                </v-avatar>
              </v-col>
              <v-col>
                <h2 class="text-h5 font-weight-bold">{{ fullName }}</h2>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ userRole }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <div class="d-flex align-center justify-center mb-2">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click="previousMonth"
                size="small"
              ></v-btn>
              <h3 class="mx-4 text-h6">{{ monthName }} {{ year }}</h3>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                @click="nextMonth"
                size="small"
              ></v-btn>
            </div>
            <p class="text-body-2 mb-2">{{ motivationalMessage }}</p>
            <v-progress-linear
              :model-value="onboardingProgress"
              color="primary"
              height="8"
              rounded
              class="mb-1"
            ></v-progress-linear>
            <p class="text-caption text-medium-emphasis">
              {{ onboardingProgress }}% complété
            </p>
            <v-tooltip location="top" activator="parent">
              <span>Onboarding sur 6 mois ({{ daysRemaining }} jours restants)</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vue mobile du calendrier -->
    <div class="d-md-none">
      <v-row>
        <v-col cols="12" v-for="event in upcomingEvents" :key="event.date">
          <v-card :color="event.color" variant="tonal">
            <v-card-text>
              <v-row align="center">
                <v-col cols="auto">
                  <v-avatar :color="event.color" size="40">
                    <v-icon :icon="event.icon" color="white"></v-icon>
                  </v-avatar>
                </v-col>
                <v-col>
                  <v-card-title class="text-body-1 pa-0">{{ event.title }}</v-card-title>
                  <v-card-subtitle class="pa-0">{{ formatEventDate(event.date) }}</v-card-subtitle>
                  <p class="text-body-2 mt-1 mb-0">{{ event.time }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Vue desktop du calendrier -->
    <div class="d-none d-md-block">
      <v-card>
        <v-card-text>
          <!-- En-têtes des jours -->
          <v-row no-gutters class="calendar-header">
            <v-col
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center py-3 font-weight-bold text-medium-emphasis"
            >
              {{ day }}
            </v-col>
          </v-row>

          <!-- Grille du calendrier -->
          <v-row
            v-for="(week, weekIndex) in calendarWeeks"
            :key="weekIndex"
            no-gutters
            class="calendar-row"
          >
            <v-col
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="calendar-cell"
              :class="{ 'other-month': !day.isCurrentMonth }"
            >
              <div class="day-container pa-2">
                <div class="day-number" :class="{ 'today': day.isToday }">
                  {{ day.day }}
                </div>
                <div class="events-container">
                  <v-chip
                    v-for="event in day.events"
                    :key="event.id"
                    size="x-small"
                    :color="event.color"
                    class="mb-1 event-chip"
                    @click="openEventDetail(event)"
                  >
                    {{ event.title }}
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Légende des événements -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-calendar-multiselect</v-icon>
            Types d'événements
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="eventType in eventTypes"
                :key="eventType.type"
                cols="6"
                sm="4"
                md="3"
              >
                <div class="d-flex align-center">
                  <v-icon :color="eventType.color" class="mr-2">{{ eventType.icon }}</v-icon>
                  <span class="text-body-2">{{ eventType.label }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Actions rapides
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" sm="4" md="3">
                <v-btn
                  color="primary"
                  block
                  prepend-icon="mdi-plus"
                  @click="addEvent"
                >
                  Nouvel événement
                </v-btn>
              </v-col>
              <v-col cols="6" sm="4" md="3">
                <v-btn
                  color="secondary"
                  block
                  prepend-icon="mdi-calendar-sync"
                  @click="syncCalendar"
                >
                  Synchroniser
                </v-btn>
              </v-col>
              <v-col cols="6" sm="4" md="3">
                <v-btn
                  color="accent"
                  block
                  prepend-icon="mdi-export"
                  @click="exportCalendar"
                >
                  Exporter
                </v-btn>
              </v-col>
              <v-col cols="6" sm="4" md="3">
                <v-btn
                  color="success"
                  block
                  prepend-icon="mdi-cog"
                  @click="openSettings"
                >
                  Paramètres
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog pour les détails d'événement -->
    <v-dialog v-model="eventDialog" max-width="500">
      <v-card v-if="selectedEvent">
        <v-card-title class="d-flex align-center">
          <v-icon :color="selectedEvent.color" class="mr-2">{{ selectedEvent.icon }}</v-icon>
          {{ selectedEvent.title }}
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-calendar">
              <v-list-item-title>{{ formatEventDate(selectedEvent.date) }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-clock">
              <v-list-item-title>{{ selectedEvent.time }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="selectedEvent.location" prepend-icon="mdi-map-marker">
              <v-list-item-title>{{ selectedEvent.location }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <p v-if="selectedEvent.description" class="mt-4">
            {{ selectedEvent.description }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="eventDialog = false" variant="text">Fermer</v-btn>
          <v-btn color="primary" @click="editEvent" prepend-icon="mdi-pencil">
            Modifier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUser } from '../composables/useUser.js'
import { useOnboarding } from '../composables/useOnboarding.js'

// Utiliser le composable centralisé pour l'utilisateur
const { fullName, userInitials, userRole, userCreatedAt } = useUser()

// Utiliser le composable d'onboarding pour la progression
const { motivationalMessage, daysRemaining, onboardingProgress } = useOnboarding()

// Date actuelle
const today = new Date()
const month = ref(today.getMonth())
const year = ref(today.getFullYear())
const eventDialog = ref(false)
const selectedEvent = ref(null)

// Jours de la semaine
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Noms des mois
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const monthName = computed(() => monthNames[month.value])

// Types d'événements
const eventTypes = [
  { type: 'meeting', label: 'Réunions', color: 'primary', icon: 'mdi-account-group' },
  { type: 'formation', label: 'Formations', color: 'secondary', icon: 'mdi-school' },
  { type: 'deadline', label: 'Échéances', color: 'error', icon: 'mdi-calendar-alert' },
  { type: 'social', label: 'Événements sociaux', color: 'success', icon: 'mdi-party-popper' }
]

// Événements - basés sur la date de création du profil utilisateur
const loadEvents = () => {
  // Récupérer la date de création depuis le composable useUser
  if (!userCreatedAt.value) {
    return [] // Pas d'utilisateur connecté
  }
  
  const createdDate = new Date(userCreatedAt.value)
  
  // Calculer les dates des événements
  const escapeGameDate = new Date(createdDate)
  escapeGameDate.setDate(escapeGameDate.getDate() + 7)
  
  const formationDate = new Date(createdDate)
  formationDate.setDate(formationDate.getDate() + 14)
  
  const evaluation30Date = new Date(createdDate)
  evaluation30Date.setDate(evaluation30Date.getDate() + 30)
  
  const evaluation60Date = new Date(createdDate)
  evaluation60Date.setDate(evaluation60Date.getDate() + 60)
  
  const evaluation90Date = new Date(createdDate)
  evaluation90Date.setDate(evaluation90Date.getDate() + 90)
  
  // Nouveaux événements basés sur la progression
  const progressEvents = [
    {
      id: 'escape-game-7',
      date: escapeGameDate.toISOString().split('T')[0],
      title: 'Début Escape Game Tech4Good',
      time: '14:00 - 16:00',
      type: 'social',
      color: 'success',
      icon: 'mdi-puzzle',
      location: 'Salle de jeu',
      description: 'Découverte ludique de Tech4Good à travers un escape game interactif'
    },
    {
      id: 'formation-14',
      date: formationDate.toISOString().split('T')[0],
      title: 'Première formation obligatoire',
      time: '09:00 - 12:00',
      type: 'formation',
      color: 'secondary',
      icon: 'mdi-school',
      location: 'Salle de formation',
      description: 'Formation d\'intégration aux processus et méthodologies Tech4Good'
    },
    {
      id: 'evaluation-30',
      date: evaluation30Date.toISOString().split('T')[0],
      title: 'Évaluation 30 jours',
      time: '10:00 - 11:00',
      type: 'deadline',
      color: 'warning',
      icon: 'mdi-calendar-alert',
      location: 'Bureau RH',
      description: 'Premier bilan de votre intégration chez Tech4Good'
    },
    {
      id: 'evaluation-60',
      date: evaluation60Date.toISOString().split('T')[0],
      title: 'Évaluation 60 jours',
      time: '10:00 - 11:00',
      type: 'deadline',
      color: 'orange',
      icon: 'mdi-calendar-alert',
      location: 'Bureau RH',
      description: 'Bilan intermédiaire de votre progression'
    },
    {
      id: 'evaluation-90',
      date: evaluation90Date.toISOString().split('T')[0],
      title: 'Évaluation 90 jours - Fin de période d\'essai',
      time: '10:00 - 11:30',
      type: 'deadline',
      color: 'error',
      icon: 'mdi-calendar-check',
      location: 'Bureau RH',
      description: 'Évaluation finale de votre période d\'onboarding et confirmation'
    }
  ]

  return progressEvents
}

const events = ref([])

// Charger les événements de façon réactive
const reloadEvents = () => {
  events.value = loadEvents()
}

// Surveiller les changements de userCreatedAt
watch(() => userCreatedAt.value, () => {
  reloadEvents()
}, { immediate: true })

// Événements à venir (pour mobile)
const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
})

// Génération du calendrier
const calendarWeeks = computed(() => {
  const firstDay = new Date(year.value, month.value, 1)
  const lastDay = new Date(year.value, month.value + 1, 0)
  const startDate = new Date(firstDay)
  
  // Ajuster au lundi précédent
  const dayOfWeek = (firstDay.getDay() + 6) % 7
  startDate.setDate(startDate.getDate() - dayOfWeek)
  
  const weeks = []
  const currentDate = new Date(startDate)
  
  for (let week = 0; week < 6; week++) {
    const weekDays = []
    for (let day = 0; day < 7; day++) {
      const dateString = currentDate.toISOString().split('T')[0]
      const dayEvents = events.value.filter(event => event.date === dateString)
      
      weekDays.push({
        day: currentDate.getDate(),
        date: dateString,
        isCurrentMonth: currentDate.getMonth() === month.value,
        isToday: dateString === today.toISOString().split('T')[0],
        events: dayEvents
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(weekDays)
    
    // Si nous avons dépassé le mois et que nous avons au moins 4 semaines
    if (currentDate.getMonth() !== month.value && weeks.length >= 4) {
      break
    }
  }
  
  return weeks
})

const previousMonth = () => {
  if (month.value === 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

const nextMonth = () => {
  if (month.value === 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}

// Fonction pour recharger les événements (appelée depuis l'extérieur)
const refreshEvents = () => {
  reloadEvents()
}

// Exposer la fonction pour l'utiliser depuis d'autres composants
defineExpose({ refreshEvents })

const formatEventDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openEventDetail = (event) => {
  selectedEvent.value = event
  eventDialog.value = true
}

const addEvent = () => {
  console.log('Ajouter un événement')
}

const syncCalendar = () => {
  console.log('Synchroniser le calendrier')
}

const exportCalendar = () => {
  console.log('Exporter le calendrier')
}

const openSettings = () => {
  console.log('Ouvrir les paramètres')
}

const editEvent = () => {
  console.log('Modifier l\'événement', selectedEvent.value)
  eventDialog.value = false
}
</script>

<style scoped>
.calendar-container {
  padding-top: 3rem;
  padding-bottom: 2rem;
}

.calendar-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.calendar-row {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.calendar-row:last-child {
  border-bottom: none;
}

.calendar-cell {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  min-height: 120px;
}

.calendar-cell:last-child {
  border-right: none;
}

.day-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
}

.day-number.today {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.other-month .day-number {
  color: rgba(var(--v-theme-on-surface), 0.38);
}

.events-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-chip {
  cursor: pointer;
  font-size: 0.7rem !important;
  height: auto !important;
  padding: 2px 6px !important;
}

@media (max-width: 960px) {
  .calendar-cell {
    min-height: 80px;
  }
  
  .event-chip {
    font-size: 0.6rem !important;
  }
}
</style>
