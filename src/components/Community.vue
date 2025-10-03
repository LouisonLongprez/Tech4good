<template>
  <div class="community-page">
    <v-container fluid class="py-6">
      <!-- Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-6" elevation="2" color="primary" variant="flat">
            <div class="text-center text-white mb-4">
              <v-icon size="48" class="mb-3" color="white">mdi-account-group</v-icon>
              <h1 class="text-h3 font-weight-bold mb-2 text-white">Communauté Tech4Good</h1>
              <p class="text-h6 font-weight-light text-white">Connectez-vous, partagez et apprenez ensemble</p>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Forums par département -->
        <v-col cols="12" lg="8">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-forum</v-icon>
              Forums par département
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col 
                  cols="12" 
                  md="6" 
                  v-for="forum in forums" 
                  :key="forum.id"
                >
                  <v-card variant="outlined" class="h-100" hover>
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center mb-3">
                        <v-avatar :color="forum.color" class="mr-3">
                          <v-icon :icon="forum.icon" color="white"></v-icon>
                        </v-avatar>
                        <div>
                          <h4 class="font-weight-bold">{{ forum.name }}</h4>
                          <p class="text-body-2 text-medium-emphasis mb-0">{{ forum.members }} membres</p>
                        </div>
                      </div>
                      
                      <p class="text-body-2 mb-3">{{ forum.description }}</p>
                      
                      <!-- Dernière activité -->
                      <div class="mb-3">
                        <v-chip size="small" color="info" variant="outlined" class="mb-2">
                          {{ forum.lastActivity }}
                        </v-chip>
                        <p class="text-caption text-medium-emphasis">{{ forum.lastPost }}</p>
                      </div>

                      <v-btn color="primary" variant="outlined" size="small" block>
                        <v-icon start>mdi-message</v-icon>
                        Rejoindre la discussion
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Discussions récentes -->
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="secondary">mdi-chat</v-icon>
                Discussions récentes
              </div>
              <v-btn color="primary" variant="outlined" size="small">
                <v-icon start>mdi-plus</v-icon>
                Nouvelle discussion
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="discussion in recentDiscussions"
                  :key="discussion.id"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40" :color="discussion.author.color">
                      <span class="text-body-2 font-weight-bold text-white">{{ discussion.author.initials }}</span>
                    </v-avatar>
                  </template>
                  
                  <div class="flex-grow-1">
                    <v-list-item-title class="font-weight-medium">
                      {{ discussion.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center">
                      <span>{{ discussion.author.name }}</span>
                      <v-icon size="12" class="mx-1">mdi-circle</v-icon>
                      <span>{{ discussion.department }}</span>
                      <v-icon size="12" class="mx-1">mdi-circle</v-icon>
                      <span>{{ discussion.time }}</span>
                    </v-list-item-subtitle>
                  </div>

                  <template v-slot:append>
                    <div class="text-center">
                      <v-chip size="small" :color="discussion.category.color" variant="outlined">
                        {{ discussion.category.name }}
                      </v-chip>
                      <p class="text-caption mt-1">{{ discussion.replies }} réponses</p>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Groupes d'intégration -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="accent">mdi-account-multiple-plus</v-icon>
              Votre promotion
            </v-card-title>
            <v-card-text>
              <div class="text-center mb-4">
                <h3 class="text-h6 font-weight-bold">Promo Septembre 2025</h3>
                <p class="text-body-2 text-medium-emphasis">{{ promoMembers.length }} nouveaux arrivants</p>
              </div>

              <!-- Avatars des membres -->
              <div class="d-flex justify-center mb-4">
                <v-avatar-group max="8" class="justify-center">
                  <v-avatar
                    v-for="member in promoMembers"
                    :key="member.id"
                    size="40"
                    :color="member.color"
                  >
                    <span class="text-body-2 font-weight-bold text-white">{{ member.initials }}</span>
                    <v-tooltip activator="parent" location="top">
                      {{ member.name }} - {{ member.department }}
                    </v-tooltip>
                  </v-avatar>
                </v-avatar-group>
              </div>

              <!-- Prochains événements promo -->
              <div class="mb-3">
                <h4 class="font-weight-medium mb-2">Prochains événements</h4>
                <v-list density="compact">
                  <v-list-item
                    v-for="event in promoEvents"
                    :key="event.id"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="event.color" size="20">{{ event.icon }}</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">{{ event.title }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ event.date }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>

              <v-btn color="accent" variant="flat" block>
                <v-icon start>mdi-calendar-plus</v-icon>
                Organiser un événement
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Membres actifs -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="success">mdi-account-star</v-icon>
              Membres les plus actifs
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="member in activeMembers"
                  :key="member.id"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40" :color="member.color">
                      <span class="text-body-2 font-weight-bold text-white">{{ member.initials }}</span>
                    </v-avatar>
                  </template>
                  
                  <div>
                    <v-list-item-title class="font-weight-medium">{{ member.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ member.department }}</v-list-item-subtitle>
                  </div>

                  <template v-slot:append>
                    <div class="text-center">
                      <v-chip size="small" color="success" variant="outlined">
                        {{ member.points }} pts
                      </v-chip>
                      <p class="text-caption mt-1">{{ member.contributions }} contrib.</p>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Messagerie instantanée -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-message-fast</v-icon>
              Chat en direct
            </v-card-title>
            <v-card-text>
              <!-- Users en ligne -->
              <div class="mb-3">
                <h4 class="font-weight-medium mb-2">En ligne maintenant ({{ onlineUsers.length }})</h4>
                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="user in onlineUsers"
                    :key="user.id"
                    size="small"
                    color="success"
                    variant="outlined"
                    prepend-icon="mdi-circle"
                  >
                    {{ user.name }}
                  </v-chip>
                </div>
              </div>

              <!-- Messages récents -->
              <div class="mb-3">
                <h4 class="font-weight-medium mb-2">Messages récents</h4>
                <div class="chat-messages">
                  <div
                    v-for="message in recentMessages"
                    :key="message.id"
                    class="d-flex align-start mb-2"
                  >
                    <v-avatar size="24" class="mr-2" :color="message.author.color">
                      <span class="text-caption font-weight-bold text-white">{{ message.author.initials }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="d-flex align-center">
                        <span class="text-body-2 font-weight-medium mr-2">{{ message.author.name }}</span>
                        <span class="text-caption text-medium-emphasis">{{ message.time }}</span>
                      </div>
                      <p class="text-body-2 mb-0">{{ message.content }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Zone de saisie -->
              <v-text-field
                v-model="newMessage"
                placeholder="Tapez votre message..."
                variant="outlined"
                density="compact"
                append-inner-icon="mdi-send"
                @click:append-inner="sendMessage"
                @keyup.enter="sendMessage"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUser } from '../composables/useUser.js'

// Reactive data
const newMessage = ref('')

// Forums data
const forums = ref([
  {
    id: 1,
    name: 'Développement',
    description: 'Discussions techniques, partage de code et best practices',
    members: 34,
    icon: 'mdi-code-tags',
    color: 'primary',
    lastActivity: 'Il y a 15 min',
    lastPost: 'Comment optimiser les performances Vue.js ? par Marc D.'
  },
  {
    id: 2,
    name: 'Design & UX',
    description: 'Créativité, design thinking et expérience utilisateur',
    members: 28,
    icon: 'mdi-palette',
    color: 'secondary',
    lastActivity: 'Il y a 1h',
    lastPost: 'Figma vs Adobe XD : vos retours ? par Emma R.'
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Stratégies marketing, growth hacking et communication',
    members: 22,
    icon: 'mdi-bullhorn',
    color: 'accent',
    lastActivity: 'Il y a 2h',
    lastPost: 'Nouvelle campagne social media par Sarah M.'
  },
  {
    id: 4,
    name: 'Management',
    description: 'Leadership, gestion d\'équipe et développement RH',
    members: 19,
    icon: 'mdi-account-tie',
    color: 'warning',
    lastActivity: 'Il y a 3h',
    lastPost: 'Techniques de motivation d\'équipe par Julie C.'
  },
  {
    id: 5,
    name: 'Innovation',
    description: 'Nouvelles technologies, IA et projets innovants',
    members: 31,
    icon: 'mdi-lightbulb',
    color: 'success',
    lastActivity: 'Il y a 30 min',
    lastPost: 'Impact de l\'IA générative sur nos projets par Thomas W.'
  },
  {
    id: 6,
    name: 'Bien-être',
    description: 'Work-life balance, sport et initiatives bien-être',
    members: 45,
    icon: 'mdi-heart',
    color: 'error',
    lastActivity: 'Il y a 45 min',
    lastPost: 'Séance yoga ce vendredi ? par Lisa K.'
  }
])

// Recent discussions
const recentDiscussions = ref([
  {
    id: 1,
    title: 'Retours sur ma première semaine chez Tech4Good',
    author: { name: 'Alex Martin', initials: 'AM', color: 'primary' },
    department: 'Développement',
    time: 'Il y a 10 min',
    replies: 7,
    category: { name: 'Intégration', color: 'success' }
  },
  {
    id: 2,
    title: 'Qui veut déjeuner ensemble demain ?',
    author: { name: 'Sophie Chen', initials: 'SC', color: 'secondary' },
    department: 'Design',
    time: 'Il y a 25 min',
    replies: 12,
    category: { name: 'Social', color: 'info' }
  },
  {
    id: 3,
    title: 'Recommandations pour apprendre React ?',
    author: { name: 'Marc Dubois', initials: 'MD', color: 'accent' },
    department: 'Développement',
    time: 'Il y a 1h',
    replies: 15,
    category: { name: 'Formation', color: 'primary' }
  },
  {
    id: 4,
    title: 'Event team building - vos idées ?',
    author: { name: 'Emma Rodriguez', initials: 'ER', color: 'success' },
    department: 'RH',
    time: 'Il y a 2h',
    replies: 8,
    category: { name: 'Événement', color: 'warning' }
  }
])

// Promo members (généré dynamiquement avec l'utilisateur actuel)
const { fullName, userInitials } = useUser()

const promoMembers = computed(() => [
  { id: 1, name: fullName.value, initials: userInitials.value, color: 'primary', department: 'Votre département' },
  { id: 2, name: 'Sophie Chen', initials: 'SC', color: 'secondary', department: 'UX Design' },
  { id: 3, name: 'Lucas Dubois', initials: 'LD', color: 'accent', department: 'Dev Backend' },
  { id: 4, name: 'Emma Rodriguez', initials: 'ER', color: 'success', department: 'Marketing' },
  { id: 5, name: 'Thomas Weber', initials: 'TW', color: 'warning', department: 'DevOps' },
  { id: 6, name: 'Julie Chen', initials: 'JC', color: 'info', department: 'Product' },
  { id: 7, name: 'Marc Silva', initials: 'MS', color: 'error', department: 'Data Science' },
  { id: 8, name: 'Lisa Kim', initials: 'LK', color: 'purple', department: 'Design' },
  { id: 9, name: 'Paul Martin', initials: 'PM', color: 'indigo', department: 'Dev Mobile' },
  { id: 10, name: 'Nina Garcia', initials: 'NG', color: 'teal', department: 'QA' }
])

// Promo events
const promoEvents = ref([
  {
    id: 1,
    title: 'After-work promo',
    date: 'Vendredi 18h',
    icon: 'mdi-glass-cocktail',
    color: 'accent'
  },
  {
    id: 2,
    title: 'Speed meeting inter-départements',
    date: 'Lundi 10h',
    icon: 'mdi-account-multiple',
    color: 'primary'
  },
  {
    id: 3,
    title: 'Visite du Lab Innovation',
    date: 'Mercredi 14h',
    icon: 'mdi-flask',
    color: 'success'
  }
])

// Active members
const activeMembers = ref([
  {
    id: 1,
    name: 'Sarah Martin',
    department: 'Marketing',
    initials: 'SM',
    color: 'primary',
    points: 124,
    contributions: 28
  },
  {
    id: 2,
    name: 'Marc Dubois',
    department: 'Développement',
    initials: 'MD',
    color: 'secondary',
    points: 98,
    contributions: 22
  },
  {
    id: 3,
    name: 'Julie Chen',
    department: 'Product',
    initials: 'JC',
    color: 'accent',
    points: 87,
    contributions: 19
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    department: 'Design',
    initials: 'ER',
    color: 'success',
    points: 76,
    contributions: 16
  }
])

// Online users
const onlineUsers = ref([
  { id: 1, name: 'Sarah' },
  { id: 2, name: 'Marc' },
  { id: 3, name: 'Julie' },
  { id: 4, name: 'Alex' },
  { id: 5, name: 'Emma' }
])

// Recent messages
const recentMessages = ref([
  {
    id: 1,
    author: { name: 'Sarah', initials: 'SM', color: 'primary' },
    content: 'Quelqu\'un pour un café ? ☕',
    time: '14:32'
  },
  {
    id: 2,
    author: { name: 'Marc', initials: 'MD', color: 'secondary' },
    content: 'La demo de cet aprem est reportée à demain',
    time: '14:28'
  },
  {
    id: 3,
    author: { name: 'Julie', initials: 'JC', color: 'accent' },
    content: 'Super session de brainstorming ! 🚀',
    time: '14:15'
  }
])

// Methods
const sendMessage = () => {
  if (newMessage.value.trim()) {
    recentMessages.value.unshift({
      id: Date.now(),
      author: { name: 'Vous', initials: 'AM', color: 'primary' },
      content: newMessage.value,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    })
    newMessage.value = ''
    
    // Limiter à 5 messages récents
    if (recentMessages.value.length > 5) {
      recentMessages.value.pop()
    }
  }
}
</script>

<style scoped>
.community-page {
  min-height: calc(100vh - 80px);
}

.chat-messages {
  max-height: 200px;
  overflow-y: auto;
}

.h-100 {
  height: 100%;
}
</style>