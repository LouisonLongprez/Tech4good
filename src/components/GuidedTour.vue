<template>
  <v-dialog v-model="showTour" persistent max-width="600px" transition="dialog-transition">
    <v-card class="guided-tour-card">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-6">
        <div class="d-flex align-center">
          <v-icon size="32" color="primary" class="mr-3">mdi-compass-outline</v-icon>
          <div>
            <h2 class="text-h5 font-weight-bold">{{ currentStep.title }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Étape {{ currentStepIndex + 1 }} sur {{ tourSteps.length }}
            </p>
          </div>
        </div>
        <v-btn 
          icon 
          variant="text" 
          @click="skipTour"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Progress -->
      <v-progress-linear
        :model-value="progress"
        color="primary"
        height="4"
        class="mx-6"
      ></v-progress-linear>

      <!-- Content -->
      <v-card-text class="pa-6">
        <div class="text-center mb-4">
          <v-icon 
            :icon="currentStep.icon" 
            size="64" 
            :color="currentStep.color"
            class="mb-3"
          ></v-icon>
        </div>
        
        <h3 class="text-h6 font-weight-medium mb-3 text-center">
          {{ currentStep.subtitle }}
        </h3>
        
        <p class="text-body-1 mb-4" v-html="currentStep.description"></p>

        <!-- Interactive elements for specific steps -->
        <div v-if="currentStep.interactive" class="mb-4">
          <v-card variant="outlined" class="pa-3">
            <div v-if="currentStep.id === 'dashboard'">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="font-weight-medium">Progression de votre intégration</span>
                <span class="text-primary font-weight-bold">42%</span>
              </div>
              <v-progress-linear
                :model-value="42"
                color="primary"
                height="8"
                rounded
              ></v-progress-linear>
            </div>
            
            <div v-if="currentStep.id === 'mentor'" class="text-center">
              <v-avatar size="48" class="mb-2" color="secondary">
                <span class="text-body-1 font-weight-bold text-white">SM</span>
              </v-avatar>
              <p class="font-weight-medium mb-1">Sarah Martin</p>
              <p class="text-caption text-medium-emphasis">Mentor suggéré • Marketing Digital</p>
            </div>
          </v-card>
        </div>

        <!-- Tips -->
        <v-alert
          v-if="currentStep.tip"
          type="info"
          variant="tonal"
          class="mb-4"
          :text="currentStep.tip"
        ></v-alert>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-6 pt-0">
        <v-btn
          v-if="currentStepIndex > 0"
          variant="outlined"
          @click="previousStep"
          :prepend-icon="'mdi-chevron-left'"
        >
          Précédent
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          variant="text"
          @click="skipTour"
          class="mr-2"
        >
          Ignorer le tour
        </v-btn>
        
        <v-btn
          color="primary"
          variant="flat"
          @click="nextStep"
          :append-icon="isLastStep ? 'mdi-check' : 'mdi-chevron-right'"
        >
          {{ isLastStep ? 'Terminer' : 'Suivant' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'tour-completed'])

// Reactive data
const showTour = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentStepIndex = ref(0)

// Tour steps
const tourSteps = ref([
  {
    id: 'welcome',
    title: 'Bienvenue chez Tech4Good ! 🎉',
    subtitle: 'Nous sommes ravis de vous accueillir',
    description: 'Cette visite guidée vous aidera à découvrir toutes les fonctionnalités de votre plateforme d\'intégration. Prenez quelques minutes pour explorer !',
    icon: 'mdi-hand-wave',
    color: 'primary',
    tip: 'Astuce : Vous pouvez refaire ce tour à tout moment depuis votre profil.'
  },
  {
    id: 'dashboard',
    title: 'Votre tableau de bord personnel',
    subtitle: 'Suivez votre progression en temps réel',
    description: 'Votre tableau de bord vous donne un aperçu de votre progression d\'intégration, vos prochains rendez-vous et vos tâches à accomplir.',
    icon: 'mdi-view-dashboard',
    color: 'secondary',
    interactive: true,
    tip: 'Consultez votre dashboard régulièrement pour rester à jour.'
  },
  {
    id: 'mentor',
    title: 'Système de mentorat intelligent',
    subtitle: 'Trouvez le mentor parfait pour vous',
    description: 'Notre IA analyse votre profil et vos objectifs pour vous proposer les mentors les plus adaptés. Le matching se base sur les compétences, la personnalité et la disponibilité.',
    icon: 'mdi-account-heart',
    color: 'accent',
    interactive: true
  },
  {
    id: 'calendar',
    title: 'Calendrier et événements',
    subtitle: 'Ne ratez aucun événement important',
    description: 'Retrouvez tous vos rendez-vous, formations, sessions de mentorat et événements d\'équipe dans un calendrier unifié.',
    icon: 'mdi-calendar-heart',
    color: 'warning'
  },
  {
    id: 'community',
    title: 'Communauté et partage',
    subtitle: 'Connectez-vous avec vos collègues',
    description: 'Participez aux discussions, partagez vos compétences et apprenez des autres dans un environnement bienveillant et collaboratif.',
    icon: 'mdi-account-group',
    color: 'success'
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt(e) ! 🚀',
    subtitle: 'Votre aventure Tech4Good commence maintenant',
    description: 'Vous avez maintenant toutes les clés en main pour réussir votre intégration. L\'équipe Tech4Good est là pour vous accompagner à chaque étape !',
    icon: 'mdi-rocket-launch',
    color: 'primary',
    tip: 'N\'hésitez pas à utiliser le chat IA si vous avez des questions.'
  }
])

// Computed
const currentStep = computed(() => tourSteps.value[currentStepIndex.value])
const isLastStep = computed(() => currentStepIndex.value === tourSteps.value.length - 1)
const progress = computed(() => ((currentStepIndex.value + 1) / tourSteps.value.length) * 100)

// Methods
const nextStep = () => {
  if (isLastStep.value) {
    completeTour()
  } else {
    currentStepIndex.value++
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const skipTour = () => {
  showTour.value = false
  // Marquer le tour comme complété même s'il est ignoré
  localStorage.setItem('tech4good-tour-completed', 'true')
}

const completeTour = () => {
  showTour.value = false
  localStorage.setItem('tech4good-tour-completed', 'true')
  emit('tour-completed')
}

// Check if user should see the tour
const shouldShowTour = () => {
  const tourCompleted = localStorage.getItem('tech4good-tour-completed')
  return !tourCompleted
}

// Lifecycle
onMounted(() => {
  // Auto-start tour for new users
  if (shouldShowTour()) {
    setTimeout(() => {
      showTour.value = true
    }, 1000) // Petit délai pour laisser la page se charger
  }
})

// Expose methods for parent components
defineExpose({
  startTour: () => {
    currentStepIndex.value = 0
    showTour.value = true
  },
  shouldShowTour
})
</script>

<style scoped>
.guided-tour-card {
  border-radius: 16px !important;
}

.v-progress-linear {
  border-radius: 4px;
}
</style>