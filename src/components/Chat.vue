<template>
  <v-container fluid class="chat-container pa-0">
    <v-row no-gutters class="h-100">
      <!-- Zone de chat principale -->
      <v-col cols="12" :md="sidebarOpen ? 8 : 12" class="d-flex flex-column">
        <v-card class="flex-grow-1 d-flex flex-column" elevation="0" rounded="0">
          <!-- Header du chat -->
          <v-card-title class="chat-header">
            <v-row align="center" no-gutters>
              <v-col>
                <div class="d-flex align-center">
                  <v-avatar color="primary" class="mr-3">
                    <v-icon color="white">mdi-robot</v-icon>
                  </v-avatar>
                  <div>
                    <h2 class="text-h6 mb-0 text-white">Assistant IA Tech4Good</h2>
                    <p class="text-caption mb-0 d-flex align-center text-white">
                      <v-icon size="small" color="success" class="mr-1">mdi-circle</v-icon>
                      En ligne
                    </p>
                  </div>
                </div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon
                  variant="text"
                  @click="toggleSidebar"
                  class="d-md-inline-flex d-none"
                >
                  <v-icon>{{ sidebarOpen ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  @click="sidebarOpen = !sidebarOpen"
                  class="d-md-none"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>

          <!-- Zone des messages -->
          <v-card-text class="messages-container flex-grow-1" ref="messagesContainer">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message-wrapper mb-4"
              :class="{ 'user-message': message.isUser }"
            >
              <div class="message-content d-flex" :class="message.isUser ? 'justify-end' : 'justify-start'">
                <!-- Avatar (pour l'IA seulement) -->
                <v-avatar
                  v-if="!message.isUser"
                  size="32"
                  color="primary"
                  class="mr-3 mt-1"
                >
                  <v-icon size="16" color="white">mdi-robot</v-icon>
                </v-avatar>

                <!-- Contenu du message -->
                <div class="message-bubble" :class="{ 'user-bubble': message.isUser }">
                  <v-card
                    :color="message.isUser ? 'primary' : 'surface'"
                    :variant="message.isUser ? 'flat' : 'tonal'"
                    class="pa-3"
                    style="max-width: 400px;"
                  >
                    <div
                      v-html="formatMessage(message.text)"
                      :class="message.isUser ? 'text-white' : ''"
                    ></div>
                    <div class="text-caption mt-2" :class="message.isUser ? 'text-white' : 'text-medium-emphasis'">
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </v-card>
                </div>

                <!-- Avatar (pour l'utilisateur seulement) -->
                <v-avatar
                  v-if="message.isUser"
                  size="32"
                  color="surface"
                  class="ml-3 mt-1"
                >
                  <v-img src="./personalpicture.png" alt="User"></v-img>
                </v-avatar>
              </div>
            </div>

            <!-- Indicateur de frappe -->
            <div v-if="isTyping" class="message-wrapper mb-4">
              <div class="message-content d-flex justify-start">
                <v-avatar size="32" color="primary" class="mr-3 mt-1">
                  <v-icon size="16" color="white">mdi-robot</v-icon>
                </v-avatar>
                <v-card color="surface" variant="tonal" class="pa-3">
                  <div class="typing-indicator d-flex align-center">
                    <v-progress-circular
                      indeterminate
                      size="16"
                      width="2"
                      color="primary"
                      class="mr-2"
                    ></v-progress-circular>
                    <span class="text-body-2">L'assistant écrit...</span>
                  </div>
                </v-card>
              </div>
            </div>
          </v-card-text>

          <!-- Questions fréquentes (mobile) -->
          <v-card-text class="d-md-none">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel title="Questions fréquentes">
                <v-expansion-panel-text>
                  <v-chip-group column>
                    <v-chip
                      v-for="question in quickQuestions"
                      :key="question"
                      size="small"
                      @click="sendQuickQuestion(question)"
                      variant="outlined"
                    >
                      {{ question }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>

          <!-- Zone de saisie -->
          <v-card-actions class="pa-4">
            <v-text-field
              v-model="currentMessage"
              placeholder="Tapez votre question ici..."
              variant="outlined"
              density="comfortable"
              hide-details
              @keyup.enter="sendMessage"
              :disabled="isTyping"
              class="mr-2"
            >
              <template v-slot:prepend-inner>
                <v-icon>mdi-message-text</v-icon>
              </template>
            </v-text-field>
            <v-btn
              icon
              color="primary"
              size="large"
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isTyping"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col
        v-if="sidebarOpen"
        cols="12"
        md="4"
        class="sidebar-col"
        :class="{ 'mobile-sidebar': $vuetify.display.mobile }"
      >
        <v-card class="h-100" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Raccourcis utiles
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="shortcut in shortcuts"
                :key="shortcut.question"
                @click="sendQuickQuestion(shortcut.question)"
                class="mb-1"
              >
                <template v-slot:prepend>
                  <v-icon :icon="shortcut.icon" :color="shortcut.color"></v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ shortcut.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-book-open</v-icon>
            Ressources
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-for="resource in resources" :key="resource.title">
                <template v-slot:prepend>
                  <v-icon :icon="resource.icon" :color="resource.color"></v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ resource.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-trophy</v-icon>
            Progression
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular
              :model-value="42"
              size="80"
              width="8"
              color="primary"
              class="mb-3"
            >
              <span class="text-h6 font-weight-bold">42%</span>
            </v-progress-circular>
            <p class="text-body-2">Intégration complétée</p>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              prepend-icon="mdi-chart-line"
              @click="goToProgress"
            >
              Voir détails
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Questions fréquentes desktop -->
    <v-bottom-sheet v-model="showQuickQuestions" class="d-none d-md-block">
      <template v-slot:activator="{ props }">
        <v-fab
          icon="mdi-help-circle"
          location="bottom end"
          app
          color="secondary"
          v-bind="props"
        ></v-fab>
      </template>
      <v-card>
        <v-card-title>Questions fréquentes</v-card-title>
        <v-card-text>
          <v-chip-group>
            <v-chip
              v-for="question in quickQuestions"
              :key="question"
              @click="sendQuickQuestion(question); showQuickQuestions = false"
              variant="outlined"
            >
              {{ question }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const sidebarOpen = ref(!mobile.value)
const showQuickQuestions = ref(false)

const messages = reactive([
  {
    id: 1,
    text: 'Bonjour ! 👋 Je suis votre assistant IA Tech4Good.<br><br>Je peux vous aider avec :<br>• Questions sur l\'onboarding<br>• Informations sur l\'entreprise<br>• Aide pour les procédures<br>• Mise en relation avec votre mentor<br><br><strong>Comment puis-je vous aider aujourd\'hui ?</strong>',
    isUser: false,
    timestamp: new Date()
  }
])

const quickQuestions = [
  'Comment contacter mon mentor ?',
  'Où sont mes documents ?',
  'Planning des formations',
  'Qui contacter en urgence ?',
  'Comment accéder à l\'escape game ?',
  'Calendrier des événements'
]

const shortcuts = [
  {
    title: 'Contacter mentor',
    question: 'Comment contacter mon mentor ?',
    icon: 'mdi-account-supervisor',
    color: 'primary'
  },
  {
    title: 'Mes documents',
    question: 'Où trouver mes documents ?',
    icon: 'mdi-folder',
    color: 'secondary'
  },
  {
    title: 'Planning formations',
    question: 'Planning formations',
    icon: 'mdi-calendar-clock',
    color: 'accent'
  },
  {
    title: 'Organigramme',
    question: 'Organigramme équipe',
    icon: 'mdi-sitemap',
    color: 'success'
  }
]

const resources = [
  { title: 'Guide d\'onboarding', icon: 'mdi-book-open', color: 'primary' },
  { title: 'Vidéos formation', icon: 'mdi-video', color: 'secondary' },
  { title: 'Contacts utiles', icon: 'mdi-phone', color: 'accent' },
  { title: 'FAQ complète', icon: 'mdi-help-circle', color: 'success' }
]

// Base de connaissances pour l'IA
const knowledgeBase = {
  'mentor': {
    keywords: ['mentor', 'mentorat', 'contacter', 'rdv', 'rencontre'],
    response: 'Pour contacter votre mentor :<br>• Utilisez le <strong>calendrier intégré</strong> pour prendre RDV<br>• Envoyez un message via la plateforme<br>• Email : mentor@tech4good.com<br>• En urgence : 01 23 45 67 89<br><br>Votre mentor actuel : <strong>Sarah Martin</strong> 👩‍💼'
  },
  'documents': {
    keywords: ['document', 'contrat', 'fichier', 'télécharger', 'papier'],
    response: 'Vos documents sont disponibles dans la section <strong>📁 Documents</strong> :<br>• Contrat de travail signé ✅<br>• Documents administratifs<br>• Guides d\'onboarding<br>• Formations obligatoires<br><br>Vous pouvez télécharger, partager ou demander validation.'
  },
  'formation': {
    keywords: ['formation', 'cours', 'apprentissage', 'quiz', 'planning'],
    response: 'Formations disponibles :<br>• <strong>🎓 Formation sécurité</strong> - Obligatoire<br>• <strong>🔧 Outils internes</strong> - Semaine 2<br>• <strong>🌍 Valeurs Tech4Good</strong> - Interactive<br>• <strong>🎮 Quiz ludiques</strong> - Points bonus<br><br>Prochaine session : Jeudi 10h'
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return

  // Ajouter message utilisateur
  const userMessage = {
    id: Date.now(),
    text: currentMessage.value,
    isUser: true,
    timestamp: new Date()
  }
  messages.push(userMessage)

  const question = currentMessage.value.toLowerCase()
  currentMessage.value = ''

  // Scroll vers le bas
  await nextTick()
  scrollToBottom()

  // Simuler typing de l'IA
  isTyping.value = true
  
  setTimeout(() => {
    const response = generateAIResponse(question)
    messages.push({
      id: Date.now(),
      text: response,
      isUser: false,
      timestamp: new Date()
    })
    isTyping.value = false
    nextTick(() => scrollToBottom())
  }, 1500)
}

const sendQuickQuestion = (question) => {
  currentMessage.value = question
  sendMessage()
}

const generateAIResponse = (question) => {
  // Recherche dans la base de connaissances
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(keyword => question.includes(keyword))) {
      return data.response
    }
  }

  // Réponses par défaut
  const defaultResponses = [
    'Je comprends votre question ! Pour une réponse précise, je vous recommande de :<br>• Consulter la section <strong>Documents</strong><br>• Contacter votre mentor<br>• Vérifier la FAQ complète<br><br>Puis-je vous aider avec autre chose ? 😊',
    'C\'est une excellente question ! Voici ce que je peux vous suggérer :<br>• Vérifiez dans votre <strong>Dashboard</strong><br>• Consultez le guide d\'onboarding<br>• N\'hésitez pas à demander à votre équipe<br><br>Besoin d\'autres informations ? 🤔'
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const formatMessage = (text) => {
  return text.replace(/\n/g, '<br>')
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const goToProgress = () => {
  // Navigation vers la page de progression
  console.log('Aller vers la progression')
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 80px);
}

.h-100 {
  height: 100%;
}

.chat-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  color: white;
}

.messages-container {
  overflow-y: auto;
  flex-grow: 1;
  padding: 1rem;
}

.message-wrapper.user-message {
  margin-left: 2rem;
}

.message-wrapper:not(.user-message) {
  margin-right: 2rem;
}

.user-bubble {
  margin-left: auto;
}

.typing-indicator {
  min-width: 60px;
}

.sidebar-col.mobile-sidebar {
  position: fixed;
  top: 80px;
  right: 0;
  z-index: 1000;
  width: 100% !important;
  max-width: 300px;
  height: calc(100vh - 80px);
}

@media (max-width: 960px) {
  .messages-container {
    padding: 0.5rem;
  }
  
  .message-wrapper.user-message {
    margin-left: 1rem;
  }
  
  .message-wrapper:not(.user-message) {
    margin-right: 1rem;
  }
}
</style>