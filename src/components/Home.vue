<template>
  <div class="home-page">
    <!-- Header avec info utilisateur -->
    <v-container fluid class="py-4">
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-4" elevation="2">
            <v-row align="center" justify="space-between">
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <v-avatar size="60" class="mr-4" color="primary">
                    <span class="text-h5 font-weight-bold text-white">{{ userInitials }}</span>
                  </v-avatar>
                  <div>
                    <h2 class="text-h5 font-weight-bold">{{ fullName }}</h2>
                    <p class="text-body-2 text-on-surface-variant mb-0">{{ userRole }}</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="text-md-right">
                <div>
                  <v-progress-linear
                    :model-value="quizProgress"
                    color="success"
                    height="8"
                    rounded
                    class="mb-1"
                  ></v-progress-linear>
                  <div class="text-caption text-medium-emphasis text-center">
                    {{ userStats.completedQuizzes }}/20 quiz réussis ({{ quizProgress }}%)
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Contenu principal - Dashboard intégré -->
      <v-row>
        <!-- Dashboard Stats -->
        <v-col cols="12" class="mb-4">
          <v-row>
            <v-col cols="12" md="3" v-for="stat in dashboardStats" :key="stat.title">
              <v-card class="text-center pa-4" :color="stat.color" variant="tonal">
                <v-icon :icon="stat.icon" size="32" :color="stat.color" class="mb-2"></v-icon>
                <h3 class="text-h6 font-weight-bold mb-1">{{ stat.value }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">{{ stat.title }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- Documents & Infos pratiques -->
        <v-col cols="12" lg="4" md="6">
          <v-card class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
              Documents & Infos pratiques
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Gérez tous vos documents importants et informations pratiques
              </p>
              <v-list density="compact">
                <!-- Contrat signé avec téléchargement -->
                <v-list-item class="cursor-pointer" hover>
                  <template v-slot:prepend>
                    <v-icon>mdi-file-document-outline</v-icon>
                  </template>
                  <v-list-item-title>Contrat signé</v-list-item-title>
                  <template v-slot:append>
                    <v-btn-group density="compact" variant="text">
                      <v-btn
                        icon="mdi-eye"
                        size="small"
                        color="primary"
                        @click="showModal = true"
                      ></v-btn>
                      <v-btn
                        icon="mdi-download"
                        size="small"
                        color="primary"
                        @click="downloadContract"
                      ></v-btn>
                    </v-btn-group>
                  </template>
                </v-list-item>
                
                <!-- Documents santé avec gestion complète -->
                <v-list-item class="cursor-pointer" hover>
                  <template v-slot:prepend>
                    <v-icon>mdi-medical-bag</v-icon>
                  </template>
                  <v-list-item-title>Documents santé ({{ healthDocuments.length }})</v-list-item-title>
                  <template v-slot:append>
                    <v-btn-group density="compact" variant="text">
                      <v-btn
                        icon="mdi-plus"
                        size="small"
                        color="primary"
                        @click="showHealthUpload = true"
                      ></v-btn>
                      <v-btn
                        icon="mdi-folder-open"
                        size="small"
                        color="primary"
                        @click="showHealthDocuments = true"
                      ></v-btn>
                    </v-btn-group>
                  </template>
                </v-list-item>
                
                <!-- Guide d'onboarding avec ajout/téléchargement/visualisation -->
                <v-list-item class="cursor-pointer" hover>
                  <template v-slot:prepend>
                    <v-icon>mdi-book-open-variant</v-icon>
                  </template>
                  <v-list-item-title>Guide de passation</v-list-item-title>
                  <template v-slot:append>
                    <v-btn-group density="compact" variant="text">
                      <v-btn
                        icon="mdi-eye"
                        size="small"
                        color="primary"
                        @click="showGuideModal = true"
                        :disabled="!hasGuide"
                      ></v-btn>
                      <v-btn
                        icon="mdi-plus"
                        size="small"
                        color="primary"
                        @click="showGuideUpload = true"
                      ></v-btn>
                      <v-btn
                        icon="mdi-download"
                        size="small"
                        color="primary"
                        @click="downloadGuide"
                        :disabled="!hasGuide"
                      ></v-btn>
                    </v-btn-group>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

      <!-- Formations & Jeux -->
      <v-col cols="12" lg="4" md="6">
        <v-card class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="secondary">mdi-school</v-icon>
            Formations & Jeux
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Découvrez nos formations interactives et jeux éducatifs
            </p>
            <v-list density="compact">
              <v-list-item :to="'/formations'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-school</v-icon>
                </template>
                <v-list-item-title>Formation interne</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="secondary">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
              
              <v-list-item :to="'/quiz'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-help</v-icon>
                </template>
                <v-list-item-title>Quiz Tech4Good</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="secondary">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
              
              <v-list-item :to="'/escape-game'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-puzzle</v-icon>
                </template>
                <v-list-item-title>Escape game</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="secondary">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Mentorat & Social -->
      <v-col cols="12" lg="4" md="6">
        <v-card class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="accent">mdi-account-group</v-icon>
            Mentorat & Social
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Connectez-vous avec vos collègues et trouvez votre mentor
            </p>
            <v-list density="compact">
              <v-list-item :to="'/mentorat'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-account-heart</v-icon>
                </template>
                <v-list-item-title>Trouver un mentor</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="accent">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
              
              <v-list-item :to="'/community'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-account-multiple</v-icon>
                </template>
                <v-list-item-title>Communauté</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="accent">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
              
              <v-list-item :to="'/blog'" hover>
                <template v-slot:prepend>
                  <v-icon>mdi-post</v-icon>
                </template>
                <v-list-item-title>Blog Tech4Good</v-list-item-title>
                <template v-slot:append>
                  <v-icon size="small" color="accent">mdi-arrow-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal pour le contrat -->
    <v-dialog v-model="showModal" max-width="90%" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Contrat signé</span>
          <v-btn icon @click="showModal = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-2">
          <v-img
            :src="contractImg"
            alt="Contrat signé"
            max-height="70vh"
            contain
          ></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal pour les documents santé -->
    <v-dialog v-model="showHealthDocuments" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Documents Santé</span>
          <v-btn icon @click="showHealthDocuments = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="doc in healthDocuments"
              :key="doc.id"
              @click="viewHealthDocument(doc)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-file-document</v-icon>
              </template>
              <v-list-item-title>{{ doc.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ doc.date }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn-group density="compact" variant="text">
                  <v-btn
                    icon="mdi-download"
                    size="small"
                    @click.stop="downloadHealthDocument(doc)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    @click.stop="deleteHealthDocument(doc)"
                  ></v-btn>
                </v-btn-group>
              </template>
            </v-list-item>
          </v-list>
          <div v-if="healthDocuments.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-file-outline</v-icon>
            <p class="text-h6 mt-4">Aucun document santé</p>
            <p class="text-body-2">Ajoutez vos premiers documents</p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal d'upload documents santé -->
    <v-dialog v-model="showHealthUpload" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Ajouter un document santé</span>
          <v-btn icon @click="showHealthUpload = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="uploadHealthDocument">
            <v-text-field
              v-model="newHealthDoc.name"
              label="Nom du document"
              prepend-icon="mdi-file-document"
              variant="outlined"
              required
              class="mb-4"
            ></v-text-field>
            
            <v-file-input
              v-model="healthFile"
              label="Fichier"
              prepend-icon="mdi-paperclip"
              variant="outlined"
              accept=".pdf,.doc,.docx,.jpg,.png"
              show-size
              class="mb-4"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn @click="showHealthUpload = false" variant="text">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            @click="uploadHealthDocument"
            :disabled="!canUploadHealth"
            prepend-icon="mdi-upload"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal d'upload guide -->
    <v-dialog v-model="showGuideUpload" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Ajouter le guide de passation</span>
          <v-btn icon @click="showGuideUpload = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="uploadGuide">
            <v-file-input
              v-model="guideFile"
              label="Guide de passation (PDF)"
              prepend-icon="mdi-book-open-variant"
              variant="outlined"
              accept=".pdf"
              show-size
              class="mb-4"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn @click="showGuideUpload = false" variant="text">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            @click="uploadGuide"
            :disabled="!canUploadGuide"
            prepend-icon="mdi-upload"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal pour visualiser le guide -->
    <v-dialog v-model="showGuideModal" max-width="90%" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Guide de passation</span>
          <v-btn icon @click="showGuideModal = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-2">
          <div v-if="hasGuide" class="text-center">
            <v-icon size="80" color="primary" class="mb-4">mdi-book-open-variant</v-icon>
            <h3 class="text-h6 mb-4">Guide de passation Tech4Good</h3>
            <p class="text-body-1 mb-6">
              Ce guide contient toutes les informations essentielles sur votre poste et métier.
              Il vous aidera à comprendre vos missions, processus et responsabilités pour une intégration optimale.
            </p>
            <v-row justify="center" class="mb-4">
              <v-col cols="auto">
                <v-chip color="success" prepend-icon="mdi-check-circle">
                  Document disponible
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-chip color="info" prepend-icon="mdi-file-pdf-box">
                  Format PDF
                </v-chip>
              </v-col>
            </v-row>
            <v-btn
              color="primary"
              prepend-icon="mdi-download"
              @click="downloadGuide"
              size="large"
            >
              Télécharger le guide
            </v-btn>
          </div>
          <div v-else class="text-center py-12">
            <v-icon size="80" color="grey">mdi-book-outline</v-icon>
            <p class="text-h6 mt-4">Aucun guide de passation disponible</p>
            <p class="text-body-2 mb-4">
              Le guide de passation vous aidera dans votre intégration en vous fournissant 
              toutes les informations sur votre métier, vos missions et les processus à suivre.
            </p>
            <p class="text-body-2">
              Demandez à votre responsable d'ajouter votre guide de passation personnalisé.
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Tour guidé component -->
    <GuidedTour 
      ref="guidedTour" 
      v-model="showGuidedTour"
      @tour-completed="onTourCompleted"
    />
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import contractImg from "@/assets/Faux_contrat.jpg";
import GuidedTour from './GuidedTour.vue';
import { useUser } from '../composables/useUser.js';
import { useOnboarding } from '../composables/useOnboarding.js';
import { authHelpers } from '../lib/supabase.js';

const showModal = ref(false);
const showGuidedTour = ref(false);
const showHealthDocuments = ref(false);
const showHealthUpload = ref(false);
const showGuideUpload = ref(false);
const showGuideModal = ref(false);
const guidedTour = ref(null);

// Utiliser le composable centralisé pour l'utilisateur
const { fullName, userInitials, userRole, isAuthenticated } = useUser()

// Utiliser le composable d'onboarding pour les données dynamiques
const { motivationalMessage, daysRemaining, onboardingProgress, nextSteps } = useOnboarding()

// État pour les statistiques utilisateur
const userStats = ref({
  completedFormations: 0,
  completedQuizzes: 0,
  totalEvents: 0,
  totalDocuments: 0 // Maintenant récupéré depuis la base de données
})

// Charger les statistiques utilisateur
const loadUserStats = async () => {
  if (!isAuthenticated.value) return
  
  try {
    // Utiliser la nouvelle fonction pour récupérer toutes les stats
    const stats = await authHelpers.getAllUserStats()
    
    userStats.value.completedFormations = stats.formations.completed
    userStats.value.completedQuizzes = stats.quiz.completedQuizzes
    userStats.value.totalEvents = stats.eventsCount
    userStats.value.totalDocuments = stats.documentsCount
    
    console.log('Stats accueil chargées:', userStats.value)
  } catch (error) {
    console.error('Erreur chargement stats accueil:', error)
  }
}

// Documents santé
const healthDocuments = ref([
  {
    id: 1,
    name: "Certificat médical d'aptitude",
    date: "2025-09-15",
    url: "#"
  },
  {
    id: 2,
    name: "Carte de sécurité sociale",
    date: "2025-09-10",
    url: "#"
  }
]);

const newHealthDoc = ref({
  name: ''
});

const healthFile = ref([]);
const guideFile = ref([]);
const hasGuide = ref(false); // Pas de guide au départ

// Computed properties
const canUploadHealth = computed(() => {
  return newHealthDoc.value.name && healthFile.value.length > 0;
});

const canUploadGuide = computed(() => {
  return guideFile.value.length > 0;
});

// Dashboard statistics
// Progression des quiz (sur 20 pour l'UX)
const quizProgress = computed(() => {
  const maxQuizzes = 20
  const completed = userStats.value.completedQuizzes
  return Math.min((completed / maxQuizzes) * 100, 100)
})

// Message motivationnel pour les quiz
const quizMotivationalMessage = computed(() => {
  const completed = userStats.value.completedQuizzes
  if (completed === 0) return "Commencez votre parcours Tech4Good ! �"
  if (completed === 1) return "Premier quiz réussi ! Continuez ! 🎯"
  if (completed === 2) return "Excellent progrès ! �"
  if (completed === 3) return "Presque au bout ! Dernier quiz ! 🏆"
  return "Parcours Tech4Good complété ! Bravo ! 🎉"
})

// Dashboard statistics - Mise à jour dynamique
const dashboardStats = computed(() => [
  {
    title: 'Formations complétées',
    value: userStats.value.completedFormations,
    icon: 'mdi-school',
    color: 'primary'
  },
  {
    title: 'Quiz réussis',
    value: userStats.value.completedQuizzes,
    icon: 'mdi-trophy',
    color: 'success'
  },
  {
    title: 'Documents',
    value: userStats.value.totalDocuments,
    icon: 'mdi-file-document',
    color: 'accent'
  },
  {
    title: 'Jours restants',
    value: daysRemaining.value,
    icon: 'mdi-calendar-clock',
    color: 'warning'
  }
])

// Charger les stats au montage
onMounted(() => {
  if (isAuthenticated.value) {
    loadUserStats()
  }
})

// Methods
const startGuidedTour = () => {
  if (guidedTour.value) {
    guidedTour.value.startTour()
  }
}

const onTourCompleted = () => {
  console.log('Tour guidé terminé depuis l\'accueil!')
}

// Documents methods
const downloadContract = () => {
  console.log('Téléchargement du contrat...');
  // Simulation téléchargement
  const link = document.createElement('a');
  link.href = contractImg;
  link.download = 'contrat-signe.jpg';
  link.click();
}

const uploadHealthDocument = () => {
  if (!canUploadHealth.value) return;
  
  const newDoc = {
    id: Date.now(),
    name: newHealthDoc.value.name,
    date: new Date().toISOString().split('T')[0],
    url: "#"
  };
  
  healthDocuments.value.push(newDoc);
  
  // Reset form
  newHealthDoc.value.name = '';
  healthFile.value = [];
  showHealthUpload.value = false;
}

const downloadHealthDocument = (doc) => {
  console.log(`Téléchargement de: ${doc.name}`);
  // Simulation téléchargement
}

const deleteHealthDocument = (doc) => {
  const index = healthDocuments.value.findIndex(d => d.id === doc.id);
  if (index > -1) {
    healthDocuments.value.splice(index, 1);
  }
}

const viewHealthDocument = (doc) => {
  console.log(`Visualisation de: ${doc.name}`);
  // Ouvrir le document
}

const uploadGuide = () => {
  if (!canUploadGuide.value) return;
  
  hasGuide.value = true;
  guideFile.value = [];
  showGuideUpload.value = false;
  console.log('Guide de passation ajouté avec succès!');
}

const downloadGuide = () => {
  if (!hasGuide.value) return;
  console.log('Téléchargement du guide de passation...');
  // Simulation téléchargement
}
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: calc(100vh - 80px);
}

.cursor-pointer {
  cursor: pointer;
}

.h-100 {
  height: 100%;
}

/* Effet hover pour les cartes cliquables */
.v-card[style*="cursor: pointer"]:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Animation des icônes de flèche */
.v-card:hover .mdi-arrow-right {
  transform: translateX(4px);
  transition: transform 0.2s ease-in-out;
}
</style>
