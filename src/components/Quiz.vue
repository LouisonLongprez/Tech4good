<template>
  <v-container fluid class="quiz-container">
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="8">
        <!-- Header du quiz -->
        <v-card class="mb-6" elevation="4" v-if="quizStarted">
          <v-card-title class="quiz-header text-center">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="12" sm="auto">
                <v-icon size="48" color="white" class="mb-2">mdi-brain</v-icon>
                <h1 class="text-h4 text-white mb-0">{{ currentCategory.name }}</h1>
                <p class="text-subtitle1 text-white mb-0">{{ currentCategory.description }}</p>
              </v-col>
            </v-row>
          </v-card-title>
          
          <!-- Barre de progression -->
          <v-card-text class="pb-0">
            <v-row align="center" class="mb-4">
              <v-col cols="12" sm="8">
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-progress-check</v-icon>
                  <span class="text-body-1 font-weight-medium">
                    Question {{ currentQuestionIndex + 1 }} sur {{ questions.length }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="((currentQuestionIndex + 1) / questions.length) * 100"
                  height="8"
                  color="primary"
                  bg-color="surface"
                  rounded
                ></v-progress-linear>
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-end">
                <v-chip
                  color="primary"
                  variant="elevated"
                  size="large"
                  prepend-icon="mdi-trophy"
                  class="mb-2"
                >
                  {{ score }} points
                </v-chip>
                <v-chip
                  v-if="streak > 1"
                  color="warning"
                  variant="elevated"
                  size="small"
                  prepend-icon="mdi-fire"
                  class="ml-2"
                >
                  {{ streak }} d'affilée
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Sélection du quiz -->
        <div v-if="!quizStarted">
          <v-card class="text-center mb-6" elevation="4">
            <v-card-text class="pa-8">
              <v-icon size="80" color="primary" class="mb-4">mdi-gamepad-variant</v-icon>
              <h1 class="text-h3 mb-4">Quiz Tech4Good</h1>
              <p class="text-h6 text-medium-emphasis mb-6">
                Testez vos connaissances et gagnez des points !
              </p>
            </v-card-text>
          </v-card>

          <!-- Catégories de quiz -->
          <v-row class="mb-6">
            <v-col
              v-for="category in quizCategories"
              :key="category.id"
              cols="12"
              sm="6"
              md="6"
              lg="3"
            >
              <v-card
                :disabled="category.locked"
                @click="!category.locked && startQuiz(category)"
                class="category-card"
                :class="{ 'elevation-8': !category.locked, 'elevation-2': category.locked }"
                :style="{ cursor: category.locked ? 'not-allowed' : 'pointer' }"
                hover
              >
                <v-card-text class="text-center pa-6">
                  <div class="category-icon mb-4">
                    <v-avatar size="64" :color="category.locked ? 'grey' : 'primary'">
                      <span class="text-h4">{{ category.icon }}</span>
                    </v-avatar>
                  </div>
                  
                  <h3 class="text-h6 mb-2">{{ category.name }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    {{ category.description }}
                  </p>
                  
                  <div class="d-flex justify-space-between align-center">
                    <v-chip
                      :color="getDifficultyColor(category.difficulty)"
                      size="small"
                      variant="tonal"
                    >
                      {{ getDifficultyText(category.difficulty) }}
                    </v-chip>
                    <v-chip size="small" variant="outlined">
                      {{ category.questions.length }} questions
                    </v-chip>
                  </div>
                </v-card-text>

                <!-- Overlay de verrouillage -->
                <v-overlay
                  v-if="category.locked"
                  :model-value="category.locked"
                  contained
                  class="d-flex align-center justify-center"
                >
                  <div class="text-center">
                    <v-icon size="48" color="white" class="mb-2">mdi-lock</v-icon>
                    <div class="text-body-1 text-white">
                      Complétez le quiz précédent
                    </div>
                  </div>
                </v-overlay>
              </v-card>
            </v-col>
          </v-row>

          <!-- Classement -->
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-trophy</v-icon>
              Classement
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(player, index) in leaderboard"
                  :key="player.id"
                  :class="{ 'bg-primary-lighten-4': player.isCurrentUser }"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="getRankColor(index)"
                      size="32"
                      class="mr-3"
                    >
                      <span class="font-weight-bold text-white">{{ index + 1 }}</span>
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title class="font-weight-medium">
                    {{ player.name }}
                    <v-chip
                      v-if="player.isCurrentUser"
                      size="x-small"
                      color="primary"
                      class="ml-2"
                    >
                      Vous
                    </v-chip>
                  </v-list-item-title>
                  
                  <template v-slot:append>
                    <v-chip color="primary" variant="outlined">
                      {{ player.totalScore }} pts
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <!-- Quiz en cours -->
        <div v-else-if="!quizCompleted">
          <v-card elevation="4">
            <v-card-text class="pa-6">
              <!-- Header de la question -->
              <div class="d-flex justify-space-between mb-4">
                <v-chip
                  :color="getDifficultyColor(currentCategory.difficulty)"
                  variant="elevated"
                >
                  {{ currentCategory.name }}
                </v-chip>
                <v-chip
                  :color="getDifficultyColor(currentCategory.difficulty)"
                  variant="tonal"
                >
                  {{ getDifficultyText(currentCategory.difficulty) }}
                </v-chip>
              </div>

              <!-- Question -->
              <h2 class="text-h5 mb-6 question-text">
                {{ currentQuestion.question }}
              </h2>

              <!-- Image de la question (si présente) -->
              <div v-if="currentQuestion.image" class="text-center mb-6">
                <v-img
                  :src="currentQuestion.image"
                  :alt="currentQuestion.question"
                  max-height="200"
                  class="mx-auto"
                  style="border-radius: 12px;"
                ></v-img>
              </div>

              <!-- Réponses -->
              <v-row class="mb-6">
                <v-col
                  v-for="(answer, index) in currentQuestion.answers"
                  :key="index"
                  cols="12"
                  md="6"
                >
                  <v-card
                    :color="getAnswerCardColor(index, answer)"
                    :variant="selectedAnswer === null ? 'outlined' : 'elevated'"
                    @click="selectAnswer(index)"
                    :disabled="selectedAnswer !== null"
                    class="answer-card"
                    :class="{ 'cursor-pointer': selectedAnswer === null }"
                    hover
                  >
                    <v-card-text class="d-flex align-center pa-4">
                      <v-avatar
                        :color="getAnswerAvatarColor(index, answer)"
                        size="32"
                        class="mr-4"
                      >
                        <span class="font-weight-bold text-white">
                          {{ String.fromCharCode(65 + index) }}
                        </span>
                      </v-avatar>
                      
                      <div class="flex-grow-1">
                        <div class="text-body-1">{{ answer.text }}</div>
                      </div>
                      
                      <div v-if="selectedAnswer !== null">
                        <v-icon
                          v-if="answer.correct"
                          color="success"
                          size="24"
                        >
                          mdi-check-circle
                        </v-icon>
                        <v-icon
                          v-else-if="selectedAnswer === index && !answer.correct"
                          color="error"
                          size="24"
                        >
                          mdi-close-circle
                        </v-icon>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Explication -->
              <v-expand-transition>
                <v-alert
                  v-if="selectedAnswer !== null"
                  :type="isCorrect ? 'success' : 'error'"
                  variant="tonal"
                  class="mb-6"
                >
                  <template v-slot:prepend>
                    <v-icon>
                      {{ isCorrect ? 'mdi-party-popper' : 'mdi-lightbulb-outline' }}
                    </v-icon>
                  </template>
                  <div>
                    <p class="font-weight-medium mb-2">
                      {{ isCorrect ? '🎉 Correct !' : '❌ Incorrect' }}
                    </p>
                    <p class="mb-2">{{ currentQuestion.explanation }}</p>
                    <div v-if="currentQuestion.tip" class="tip-section">
                      <v-icon size="small" class="mr-1">mdi-lightbulb</v-icon>
                      <strong>Conseil :</strong> {{ currentQuestion.tip }}
                    </div>
                  </div>
                </v-alert>
              </v-expand-transition>

              <!-- Bouton suivant -->
              <div class="text-center" v-if="selectedAnswer !== null">
                <v-btn
                  color="primary"
                  size="large"
                  @click="nextQuestion"
                  :append-icon="currentQuestionIndex < questions.length - 1 ? 'mdi-arrow-right' : 'mdi-flag-checkered'"
                >
                  {{ currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats' }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Résultats du quiz -->
        <div v-else>
          <v-card elevation="4">
            <v-card-text class="text-center pa-8">
              <v-icon size="80" color="primary" class="mb-4">mdi-party-popper</v-icon>
              <h1 class="text-h3 mb-6">Quiz terminé !</h1>
              
              <!-- Score final -->
              <v-row justify="center" class="mb-6">
                <v-col cols="12" sm="6" md="4">
                  <v-card :color="getScoreColor()" variant="tonal">
                    <v-card-text class="text-center pa-6">
                      <div class="text-h2 font-weight-bold mb-2">{{ score }}</div>
                      <div class="text-subtitle1 mb-2">points</div>
                      <div class="text-body-2">{{ getScorePercentage() }}% de réussite</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Statistiques détaillées -->
              <v-row class="mb-6">
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="32" color="success" class="mb-2">mdi-check-circle</v-icon>
                      <div class="text-h6">{{ correctAnswers }}</div>
                      <div class="text-body-2">Correctes</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="32" color="error" class="mb-2">mdi-close-circle</v-icon>
                      <div class="text-h6">{{ questions.length - correctAnswers }}</div>
                      <div class="text-body-2">Incorrectes</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="32" color="warning" class="mb-2">mdi-lightning-bolt</v-icon>
                      <div class="text-h6">{{ maxStreak }}</div>
                      <div class="text-body-2">Série max</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="32" color="info" class="mb-2">mdi-timer</v-icon>
                      <div class="text-h6">{{ formatTime(totalTime) }}</div>
                      <div class="text-body-2">Temps</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Accomplissements -->
              <div v-if="achievements.length > 0" class="mb-6">
                <h3 class="text-h5 mb-4">
                  <v-icon class="mr-2" color="warning">mdi-medal</v-icon>
                  Accomplissements débloqués
                </h3>
                <v-row>
                  <v-col
                    v-for="achievement in achievements"
                    :key="achievement.id"
                    cols="12"
                    md="6"
                  >
                    <v-card color="warning" variant="tonal">
                      <v-card-text class="d-flex align-center pa-4">
                        <v-avatar size="48" color="warning" class="mr-4">
                          <span class="text-h6">{{ achievement.icon }}</span>
                        </v-avatar>
                        <div>
                          <div class="font-weight-bold">{{ achievement.name }}</div>
                          <div class="text-body-2">{{ achievement.description }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- Actions finales -->
              <div class="d-flex flex-column flex-sm-row gap-3 justify-center">
                <v-btn
                  color="secondary"
                  size="large"
                  @click="restartQuiz"
                  prepend-icon="mdi-restart"
                >
                  Recommencer
                </v-btn>
                <v-btn
                  color="primary"
                  size="large"
                  @click="selectNewQuiz"
                  prepend-icon="mdi-target"
                >
                  Autre quiz
                </v-btn>
                <v-btn
                  variant="outlined"
                  size="large"
                  @click="shareResults"
                  prepend-icon="mdi-share"
                >
                  Partager
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar pour les messages -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSnackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUser } from '../composables/useUser.js'
import { authHelpers } from '../lib/supabase.js'

// Utiliser le composable centralisé pour l'utilisateur
const { fullName, isAuthenticated } = useUser()

const quizStarted = ref(false)
const quizCompleted = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const userAnswers = ref([]) // Suivre toutes les réponses de l'utilisateur
const score = ref(0)
const correctAnswers = ref(0)
const streak = ref(0)
const maxStreak = ref(0)
const startTime = ref(null)
const totalTime = ref(0)
const currentCategory = ref(null)
const questions = ref([])
const achievements = ref([])
const showSnackbar = ref(false)
const snackbarMessage = ref('')

const isCorrect = computed(() => {
  if (selectedAnswer.value === null) return false
  return questions.value[currentQuestionIndex.value]?.answers[selectedAnswer.value]?.correct
})

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

const quizCategories = reactive([
  {
    id: 'onboarding',
    name: 'Onboarding',
    icon: '🚀',
    description: 'Bases de votre intégration',
    difficulty: 'easy',
    locked: false,
    questions: [
      {
        question: 'Quelle est la mission principale de Tech4Good ?',
        answers: [
          { text: 'Développer des apps mobiles', correct: false },
          { text: 'Utiliser la tech pour l\'impact social', correct: true },
          { text: 'Créer des jeux vidéo', correct: false },
          { text: 'Vendre des ordinateurs', correct: false }
        ],
        explanation: 'Tech4Good utilise la technologie pour créer un impact social positif et résoudre des problèmes sociétaux.',
        tip: 'Cette mission guide toutes nos décisions produit !'
      },
      {
        question: 'Combien de temps dure la période d\'onboarding complète ?',
        answers: [
          { text: '1 mois', correct: false },
          { text: '3 mois', correct: false },
          { text: '6 mois', correct: true },
          { text: '1 an', correct: false }
        ],
        explanation: 'La roadmap d\'onboarding s\'étend sur 6 mois pour une intégration progressive et complète.',
        tip: 'Chaque étape est importante pour votre réussite !'
      }
    ]
  },
  {
    id: 'security',
    name: 'Sécurité',
    icon: '🛡️',
    description: 'Règles de sécurité IT',
    difficulty: 'medium',
    locked: false,
    questions: [
      {
        question: 'Quelle est la règle principale pour les mots de passe ?',
        answers: [
          { text: 'Minimum 8 caractères avec symboles', correct: true },
          { text: 'Utiliser son nom + année', correct: false },
          { text: 'Un seul mot de passe pour tout', correct: false },
          { text: 'Partager avec son équipe', correct: false }
        ],
        explanation: 'Un mot de passe sécurisé doit contenir au moins 8 caractères avec lettres, chiffres et symboles.',
        tip: 'Utilisez un gestionnaire de mots de passe !'
      }
    ]
  },
  {
    id: 'culture',
    name: 'Culture d\'entreprise',
    icon: '🌟',
    description: 'Valeurs et culture Tech4Good',
    difficulty: 'medium',
    locked: true,
    questions: []
  },
  {
    id: 'advanced',
    name: 'Expertise',
    icon: '🎓',
    description: 'Connaissances avancées',
    difficulty: 'hard',
    locked: true,
    questions: []
  }
])

const leaderboard = computed(() => [
  { id: 1, name: 'Sarah M.', totalScore: 1250, isCurrentUser: false },
  { id: 2, name: `${fullName.value} (Vous)`, totalScore: 890, isCurrentUser: true },
  { id: 3, name: 'Thomas R.', totalScore: 780, isCurrentUser: false },
  { id: 4, name: 'Marie L.', totalScore: 650, isCurrentUser: false },
  { id: 5, name: 'David K.', totalScore: 520, isCurrentUser: false }
])

const startQuiz = (category) => {
  if (category.locked) return
  
  currentCategory.value = category
  questions.value = [...category.questions]
  quizStarted.value = true
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  score.value = 0
  correctAnswers.value = 0
  streak.value = 0
  maxStreak.value = 0
  startTime.value = Date.now()
  achievements.value = []
  userAnswers.value = [] // Réinitialiser les réponses utilisateur
}

const selectAnswer = (answerIndex) => {
  if (selectedAnswer.value !== null) return
  
  selectedAnswer.value = answerIndex
  
  // Enregistrer la réponse de l'utilisateur
  userAnswers.value[currentQuestionIndex.value] = isCorrect.value
  
  if (isCorrect.value) {
    correctAnswers.value++
    streak.value++
    maxStreak.value = Math.max(maxStreak.value, streak.value)
    
    // Points basés sur la difficulté et la série
    const basePoints = {
      easy: 10,
      medium: 20,
      hard: 30
    }[currentCategory.value.difficulty]
    
    const streakBonus = Math.min(streak.value - 1, 5) * 2
    score.value += basePoints + streakBonus
  } else {
    streak.value = 0
  }
  
  checkAchievements()
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  } else {
    completeQuiz()
  }
}

const completeQuiz = async () => {
  totalTime.value = Date.now() - startTime.value
  quizCompleted.value = true
  
  // Sauvegarder le résultat dans Supabase
  if (isAuthenticated.value) {
    try {
      await authHelpers.saveQuizResult({
        category: currentCategory.value.id,
        title: currentCategory.value.name,
        score: Math.round((correctAnswers.value / questions.value.length) * 100),
        totalQuestions: questions.value.length,
        correctAnswers: correctAnswers.value,
        answers: userAnswers.value
      })
      
      console.log(`✅ Quiz "${currentCategory.value.name}" sauvegardé: ${correctAnswers.value}/${questions.value.length} bonnes réponses`)
    } catch (error) {
      console.error('Erreur sauvegarde quiz:', error)
    }
  }
  
  // Mettre à jour le leaderboard
  const currentUser = leaderboard.find(p => p.isCurrentUser)
  if (currentUser) {
    currentUser.totalScore += score.value
  }
  
  // Débloquer le prochain quiz si score suffisant
  if (getScorePercentage() >= 70) {
    const currentIndex = quizCategories.findIndex(c => c.id === currentCategory.value.id)
    if (currentIndex < quizCategories.length - 1) {
      quizCategories[currentIndex + 1].locked = false
    }
  }
}

const checkAchievements = () => {
  const newAchievements = []
  
  if (streak.value === 3 && !achievements.value.find(a => a.id === 'streak3')) {
    newAchievements.push({
      id: 'streak3',
      name: 'En feu !',
      icon: '🔥',
      description: '3 bonnes réponses d\'affilée'
    })
  }
  
  if (streak.value === 5 && !achievements.value.find(a => a.id === 'streak5')) {
    newAchievements.push({
      id: 'streak5',
      name: 'Inarrêtable !',
      icon: '⚡',
      description: '5 bonnes réponses d\'affilée'
    })
  }
  
  achievements.value.push(...newAchievements)
}

const getAnswerCardColor = (index, answer) => {
  if (selectedAnswer.value === null) return 'surface'
  if (answer.correct) return 'success'
  if (selectedAnswer.value === index && !answer.correct) return 'error'
  return 'surface'
}

const getAnswerAvatarColor = (index, answer) => {
  if (selectedAnswer.value === null) return 'primary'
  if (answer.correct) return 'success'
  if (selectedAnswer.value === index && !answer.correct) return 'error'
  return 'surface'
}

const getDifficultyText = (difficulty) => {
  const texts = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile'
  }
  return texts[difficulty] || difficulty
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'success',
    medium: 'warning',
    hard: 'error'
  }
  return colors[difficulty] || 'primary'
}

const getRankColor = (index) => {
  if (index === 0) return 'warning' // Or
  if (index === 1) return 'grey' // Argent
  if (index === 2) return 'orange' // Bronze
  return 'primary'
}

const getScoreColor = () => {
  const percentage = getScorePercentage()
  if (percentage >= 80) return 'success'
  if (percentage >= 60) return 'warning'
  return 'error'
}

const getScorePercentage = () => {
  return Math.round((correctAnswers.value / questions.value.length) * 100)
}

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const restartQuiz = () => {
  quizCompleted.value = false
  startQuiz(currentCategory.value)
}

const selectNewQuiz = () => {
  quizStarted.value = false
  quizCompleted.value = false
}

const shareResults = () => {
  const text = `J'ai obtenu ${score.value} points au quiz ${currentCategory.value.name} Tech4Good ! 🎉`
  if (navigator.share) {
    navigator.share({ text })
  } else {
    navigator.clipboard.writeText(text)
    snackbarMessage.value = 'Résultat copié dans le presse-papier !'
    showSnackbar.value = true
  }
}
</script>

<style scoped>
.quiz-container {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.quiz-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  color: white;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover:not([disabled]) {
  transform: translateY(-4px);
}

.answer-card {
  transition: all 0.3s ease;
}

.answer-card:hover:not([disabled]) {
  transform: translateY(-2px);
}

.cursor-pointer {
  cursor: pointer;
}

.question-text {
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
}

.tip-section {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

@media (max-width: 600px) {
  .quiz-container {
    padding: 0.5rem;
  }
  
  .question-text {
    font-size: 1.25rem;
  }
}
</style>