<template>
  <v-container fluid class="formations-container">
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="text-center mb-6">
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            <v-icon class="mr-3" size="large">mdi-school</v-icon>
            Formations Tech4Good
          </h1>
          <p class="text-h6 text-medium-emphasis">
            Développez vos compétences pour un impact social positif
          </p>
        </div>
        
        <div class="d-flex justify-center">
          <v-btn-toggle 
            v-model="currentView" 
            mandatory 
            variant="outlined"
            divided
            class="formation-tabs"
          >
            <v-btn 
              value="available" 
              prepend-icon="mdi-book-open-variant"
              size="large"
              class="px-8"
            >
              Disponibles
            </v-btn>
            <v-btn 
              value="registered" 
              prepend-icon="mdi-calendar-check"
              size="large"
              class="px-8"
            >
              Mes inscriptions
            </v-btn>
            <v-btn 
              value="completed" 
              prepend-icon="mdi-check-circle"
              size="large"
              class="px-8"
            >
              Terminées
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
    </v-row>

    <!-- Filtres -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categoryOptions"
          label="Catégorie"
          prepend-icon="mdi-filter"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedLevel"
          :items="levelOptions"
          label="Niveau"
          prepend-icon="mdi-chart-line"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchTerm"
          label="Rechercher..."
          prepend-icon="mdi-magnify"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Liste des formations -->
    <v-row>
      <v-col
        v-for="formation in filteredFormations"
        :key="formation.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="h-100" :hover="true">
          <v-img
            :src="formation.image"
            height="200"
            cover
            class="position-relative"
          >
            <div class="position-absolute top-0 right-0 pa-3">
              <v-chip
                :color="getCategoryColor(formation.category)"
                size="small"
                variant="flat"
              >
                {{ formation.category }}
              </v-chip>
            </div>
            <div class="position-absolute bottom-0 left-0 pa-3">
              <v-chip
                :color="getLevelColor(formation.level)"
                size="small"
                variant="tonal"
              >
                {{ formation.level }}
              </v-chip>
            </div>
          </v-img>
          
          <v-card-title class="text-h6">
            {{ formation.title }}
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-2 mb-3">{{ formation.description }}</p>
            
            <v-row align="center" class="mb-3">
              <v-col cols="auto">
                <v-icon size="small" class="mr-1">mdi-clock</v-icon>
                <span class="text-caption">{{ formation.duration }}</span>
              </v-col>
              <v-col cols="auto">
                <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                <span class="text-caption">{{ formation.participants }} inscrits</span>
              </v-col>
            </v-row>

            <!-- Progression pour les formations inscrites/terminées -->
            <div v-if="formation.status !== 'available'" class="mb-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption">Progression</span>
                <span class="text-caption">{{ formation.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="formation.progress"
                :color="formation.status === 'completed' ? 'success' : 'primary'"
                height="6"
                rounded
              ></v-progress-linear>
            </div>

            <!-- Date pour les formations inscrites -->
            <div v-if="formation.status === 'registered'" class="mb-3">
              <v-chip
                color="info"
                prepend-icon="mdi-calendar"
                size="small"
                variant="tonal"
              >
                {{ formatDate(formation.scheduledDate) }}
              </v-chip>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-btn
              v-if="formation.status === 'available'"
              color="primary"
              variant="flat"
              @click="registerToFormation(formation)"
              block
            >
              S'inscrire
            </v-btn>
            
            <v-btn
              v-else-if="formation.status === 'registered'"
              color="secondary"
              variant="outlined"
              @click="viewFormationDetails(formation)"
              block
            >
              Voir détails
            </v-btn>
            
            <v-btn
              v-else-if="formation.status === 'completed'"
              color="success"
              variant="tonal"
              @click="viewCertificate(formation)"
              block
            >
              Voir certificat
            </v-btn>
            
            <!-- Bouton pour marquer comme terminé si en cours -->
            <v-btn
              v-else-if="formation.status === 'registered' || formation.status === 'in_progress'"
              color="success"
              variant="outlined"
              @click="completeFormation(formation.id)"
              block
            >
              <v-icon start>mdi-check</v-icon>
              Marquer comme terminé
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal d'inscription -->
    <v-dialog v-model="showRegistrationModal" max-width="600" persistent>
      <v-card v-if="selectedFormation">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Inscription à la formation</span>
          <v-btn icon @click="showRegistrationModal = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <h3 class="text-h6 mb-3">{{ selectedFormation.title }}</h3>
          <p class="text-body-2 mb-4">{{ selectedFormation.description }}</p>
          
          <v-row class="mb-4">
            <v-col cols="6">
              <v-chip prepend-icon="mdi-clock" color="primary" variant="tonal">
                {{ selectedFormation.duration }}
              </v-chip>
            </v-col>
            <v-col cols="6">
              <v-chip prepend-icon="mdi-chart-line" :color="getLevelColor(selectedFormation.level)" variant="tonal">
                {{ selectedFormation.level }}
              </v-chip>
            </v-col>
          </v-row>

          <v-select
            v-model="selectedSchedule"
            :items="availableSchedules"
            label="Choisir une session"
            prepend-icon="mdi-calendar"
            variant="outlined"
            required
          ></v-select>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn @click="showRegistrationModal = false" variant="text">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            @click="confirmRegistration"
            :disabled="!selectedSchedule"
            prepend-icon="mdi-check"
          >
            Confirmer l'inscription
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUser } from '../composables/useUser.js'
import { authHelpers } from '../lib/supabase.js'

// Utiliser le composable centralisé pour l'utilisateur
const { currentUser, isAuthenticated } = useUser()

// État de chargement
const isLoading = ref(false)
const userFormationsProgress = ref([])

// Computed properties pour les statistiques dynamiques
const completedFormationsCount = computed(() => {
  return formations.value.filter(f => f.status === 'completed').length
})

const registeredFormationsCount = computed(() => {
  return formations.value.filter(f => f.status === 'registered').length
})

const totalFormationsCount = computed(() => {
  return formations.value.length
})

const currentView = ref('available')
const selectedCategory = ref('')
const selectedLevel = ref('')
const searchTerm = ref('')
const showRegistrationModal = ref(false)
const selectedFormation = ref(null)
const selectedSchedule = ref('')

const categoryOptions = [
  { title: 'Sécurité', value: 'securite' },
  { title: 'Développement', value: 'dev' },
  { title: 'Gestion de projet', value: 'gestion' },
  { title: 'Communication', value: 'communication' },
  { title: 'Tech4Good', value: 'tech4good' }
]

const levelOptions = [
  { title: 'Débutant', value: 'debutant' },
  { title: 'Intermédiaire', value: 'intermediaire' },
  { title: 'Avancé', value: 'avance' }
]

// Charger la progression des formations de l'utilisateur
const loadUserProgress = async () => {
  if (!isAuthenticated.value) return
  
  try {
    isLoading.value = true
    const userFormations = await authHelpers.getUserFormations()
    
    // Mettre à jour le statut des formations selon la progression
    formations.value.forEach(formation => {
      const userFormation = userFormations.find(uf => uf.formation_id === formation.id.toString())
      if (userFormation) {
        formation.progress = userFormation.progress
        formation.status = userFormation.status
        if (userFormation.status === 'completed') {
          formation.completedDate = new Date(userFormation.completed_at).toLocaleDateString('fr-FR')
        }
        if (userFormation.registered_at) {
          formation.scheduledDate = userFormation.registered_at
        }
      }
    })
  } catch (error) {
    console.error('Erreur chargement progression:', error)
  } finally {
    isLoading.value = false
  }
}

// Sauvegarder la progression d'une formation
const saveFormationProgress = async (formationId, status, progress = 0) => {
  if (!isAuthenticated.value) return
  
  try {
    const formation = formations.value.find(f => f.id === formationId)
    if (!formation) return
    
    await authHelpers.saveFormationProgress(
      formationId.toString(), 
      formation.title, 
      status, 
      progress
    )
    await loadUserProgress() // Recharger pour mettre à jour l'affichage
  } catch (error) {
    console.error('Erreur sauvegarde progression:', error)
  }
}

// Marquer une formation comme terminée
const completeFormation = async (formationId) => {
  await saveFormationProgress(formationId, 'completed', 100)
}

// Démarrer une formation
const startFormation = async (formationId) => {
  await saveFormationProgress(formationId, 'registered', 0)
}

// Charger la progression au montage et quand l'utilisateur change
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    loadUserProgress()
  }
}, { immediate: true })

onMounted(() => {
  if (isAuthenticated.value) {
    loadUserProgress()
  }
})

const availableSchedules = [
  { title: 'Lundi 7 octobre 2025 - 9h00-12h00', value: '2025-10-07T09:00' },
  { title: 'Mercredi 9 octobre 2025 - 14h00-17h00', value: '2025-10-09T14:00' },
  { title: 'Vendredi 11 octobre 2025 - 9h00-12h00', value: '2025-10-11T09:00' }
]

const formations = ref([
  {
    id: 1,
    title: 'Impact social et mesure d\'efficacité',
    description: 'Apprenez à évaluer et optimiser l\'impact social de vos projets technologiques.',
    category: 'tech4good',
    level: 'debutant',
    duration: '3h',
    participants: 18,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 2,
    title: 'Valeurs Tech4Good : L\'humain au centre',
    description: 'Découvrez nos valeurs fondatrices et comment les intégrer dans votre quotidien professionnel.',
    category: 'tech4good',
    level: 'debutant',
    duration: '2h',
    participants: 25,
    status: 'available', // Sera mis à jour dynamiquement selon la progression utilisateur
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop&auto=format',
    progress: 0 // Sera mis à jour dynamiquement
  },
  {
    id: 3,
    title: 'Gestion de projet à impact social',
    description: 'Méthodes agiles adaptées aux projets sociaux : Scrum for Good, Kanban solidaire.',
    category: 'gestion',
    level: 'intermediaire',
    duration: '4h',
    participants: 12,
    status: 'available', // Sera mis à jour dynamiquement
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format',
    progress: 0 // Sera mis à jour dynamiquement
  },
  {
    id: 4,
    title: 'Numérique responsable et éco-conception',
    description: 'Développer des solutions numériques respectueuses de l\'environnement.',
    category: 'dev',
    level: 'intermediaire',
    duration: '3h30',
    participants: 16,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 5,
    title: 'Communication bienveillante en équipe',
    description: 'Développer l\'écoute active et la collaboration dans un environnement Tech4Good.',
    category: 'communication',
    level: 'debutant',
    duration: '2h30',
    participants: 20,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 6,
    title: 'APIs solidaires et partage de données',
    description: 'Créer des APIs pour faciliter la collaboration entre associations et ONG.',
    category: 'dev',
    level: 'avance',
    duration: '5h',
    participants: 8,
    status: 'registered',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&auto=format',
    progress: 60,
    scheduledDate: '2025-10-20T09:00'
  },
  {
    id: 7,
    title: 'Accessibilité numérique pour l\'inclusion',
    description: 'Créer des interfaces accessibles à tous : WCAG, ARIA et inclusion sociale.',
    category: 'dev',
    level: 'intermediaire',
    duration: '4h',
    participants: 14,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 8,
    title: 'Leadership bienveillant et autonomie',
    description: 'Management basé sur la confiance et la valorisation des contributions sociales.',
    category: 'gestion',
    level: 'avance',
    duration: '6h',
    participants: 10,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 9,
    title: 'IA éthique et bien commun',
    description: 'Développer une intelligence artificielle au service de l\'intérêt général.',
    category: 'tech4good',
    level: 'avance',
    duration: '5h',
    participants: 15,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format',
    progress: 0
  },
  {
    id: 10,
    title: 'Collaboration sur Slack et outils libres',
    description: 'Maîtriser nos outils de communication et systèmes Linux pour une meilleure collaboration.',
    category: 'communication',
    level: 'debutant',
    duration: '2h',
    participants: 22,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&auto=format',
    progress: 0
  }
])

const filteredFormations = computed(() => {
  return formations.value.filter(formation => {
    // Filtre par vue actuelle
    const matchesView = currentView.value === 'available' ? formation.status === 'available' :
                       currentView.value === 'registered' ? formation.status === 'registered' :
                       formation.status === 'completed'
    
    // Filtre par catégorie
    const matchesCategory = !selectedCategory.value || formation.category === selectedCategory.value
    
    // Filtre par niveau
    const matchesLevel = !selectedLevel.value || formation.level === selectedLevel.value
    
    // Filtre par recherche
    const matchesSearch = !searchTerm.value || 
      formation.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      formation.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    return matchesView && matchesCategory && matchesLevel && matchesSearch
  })
})

const getCategoryColor = (category) => {
  const colors = {
    securite: 'error',
    dev: 'primary',
    gestion: 'warning',
    communication: 'purple',
    tech4good: 'success'
  }
  return colors[category] || 'default'
}

const getLevelColor = (level) => {
  const colors = {
    debutant: 'success',
    intermediaire: 'warning',
    avance: 'error'
  }
  return colors[level] || 'default'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const registerToFormation = (formation) => {
  selectedFormation.value = formation
  showRegistrationModal.value = true
}

const confirmRegistration = async () => {
  if (!selectedFormation.value || !selectedSchedule.value) return
  
  try {
    // Démarrer la formation dans Supabase
    await startFormation(selectedFormation.value.id)
    
    // Créer l'événement pour le calendrier
    const calendarEvent = {
      id: `formation-${selectedFormation.value.id}`,
      title: `Formation: ${selectedFormation.value.title}`,
      start: selectedSchedule.value,
      end: new Date(new Date(selectedSchedule.value).getTime() + (parseFloat(selectedFormation.value.duration) * 60 * 60 * 1000)).toISOString(),
      category: 'formation',
      description: selectedFormation.value.description,
      location: 'Tech4Good - Salle de formation',
      color: 'primary',
      type: 'formation'
    }
    
    // Sauvegarder dans le localStorage pour le calendrier
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]')
  existingEvents.push(calendarEvent)
  localStorage.setItem('calendarEvents', JSON.stringify(existingEvents))
  
    console.log(`Formation "${selectedFormation.value.title}" ajoutée au calendrier pour le ${formatDate(selectedSchedule.value)}`)
    console.log('Événement calendrier créé:', calendarEvent)
    
    // Reset et fermer
    selectedFormation.value = null
    selectedSchedule.value = ''
    showRegistrationModal.value = false
    
    // Changer la vue vers les inscrites
    currentView.value = 'registered'
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
  }
}

const viewFormationDetails = (formation) => {
  console.log(`Voir détails de: ${formation.title}`)
  // Ouvrir les détails de la formation
}

const viewCertificate = (formation) => {
  console.log(`Voir certificat de: ${formation.title}`)
  // Ouvrir le certificat
}
</script>

<style scoped>
.formations-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 80px);
}

.formation-tabs {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.formation-tabs .v-btn {
  border-radius: 0 !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.formation-tabs .v-btn:first-child {
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}

.formation-tabs .v-btn:last-child {
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

.h-100 {
  height: 100%;
}

.position-absolute {
  position: absolute !important;
}

.top-0 {
  top: 0 !important;
}

.right-0 {
  right: 0 !important;
}

.bottom-0 {
  bottom: 0 !important;
}

.left-0 {
  left: 0 !important;
}

/* Animation des cartes */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px !important;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
}

/* Amélioration des images */
.v-img {
  border-radius: 16px 16px 0 0 !important;
}

/* Espacement amélioré */
.v-container {
  max-width: 1400px;
}

/* Meilleur contraste pour les chips */
.v-chip {
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Animation des boutons */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
}
</style>