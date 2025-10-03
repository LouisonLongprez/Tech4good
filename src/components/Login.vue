<template>
  <div class="login-page">
    <!-- Background avec gradient -->
    <div class="login-background">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <!-- Carte de login -->
            <v-card class="login-card" elevation="12">
              <!-- Header avec logo -->
              <v-card-text class="text-center pa-8">
                <div class="mb-6">
                  <v-avatar size="80" color="primary" class="mb-4">
                    <v-icon size="40" color="white">mdi-earth</v-icon>
                  </v-avatar>
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">Tech4Good</h1>
                  <p class="text-h6 text-medium-emphasis">Plateforme d'Onboarding</p>
                </div>

                <!-- Formulaire de connexion -->
                <v-form @submit.prevent="handleLogin" ref="loginForm">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    :rules="emailRules"
                    class="mb-4"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Mot de passe"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="passwordRules"
                    class="mb-4"
                    required
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>

                  <div class="d-flex justify-space-between align-center mb-6">
                    <v-checkbox
                      v-model="rememberMe"
                      label="Se souvenir de moi"
                      density="compact"
                      hide-details
                    ></v-checkbox>
                    
                    <v-btn
                      variant="text"
                      size="small"
                      color="primary"
                      @click="showForgotPassword = true"
                    >
                      Mot de passe oublié ?
                    </v-btn>
                  </div>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    class="mb-4"
                    :loading="loading"
                  >
                    Se connecter
                  </v-btn>
                </v-form>



                <!-- Lien d'inscription -->
                <div class="mt-6 text-center">
                  <p class="text-body-2 text-medium-emphasis">
                    Pas encore de compte ?
                    <v-btn
                      variant="text"
                      color="primary"
                      @click="$router.push('/register')"
                      class="pa-0"
                    >
                      S'inscrire
                    </v-btn>
                  </p>
                </div>
              </v-card-text>
            </v-card>

            <!-- Informations additionnelles -->
            <v-card class="mt-4" variant="outlined">
              <v-card-text class="text-center pa-4">
                <h3 class="text-h6 font-weight-bold mb-2">Compte de démonstration</h3>
                <p class="text-body-2 text-medium-emphasis mb-3">
                  Utilisez ces identifiants pour tester la plateforme :
                </p>
                <div class="demo-credentials">
                  <v-chip color="info" variant="tonal" class="mr-2 mb-2">
                    <v-icon start>mdi-email</v-icon>
                    demo@tech4good.fr
                  </v-chip>
                  <v-chip color="info" variant="tonal" class="mb-2">
                    <v-icon start>mdi-lock</v-icon>
                    demo123
                  </v-chip>
                </div>
                <v-btn
                  size="small"
                  color="info"
                  variant="outlined"
                  @click="fillDemoCredentials"
                  class="mt-2"
                >
                  Remplir automatiquement
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Modal mot de passe oublié -->
    <v-dialog v-model="showForgotPassword" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Réinitialiser le mot de passe</v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
          <v-text-field
            v-model="resetEmail"
            label="Adresse email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            :rules="emailRules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showForgotPassword = false">Annuler</v-btn>
          <v-btn color="primary" @click="handleResetPassword">Envoyer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authHelpers } from '../lib/supabase.js'

const router = useRouter()

// État du formulaire
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

// Modal mot de passe oublié
const showForgotPassword = ref(false)
const resetEmail = ref('')

// Notifications
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Règles de validation
const emailRules = [
  v => !!v || 'Email requis',
  v => /.+@.+\..+/.test(v) || 'Email invalide'
]

const passwordRules = [
  v => !!v || 'Mot de passe requis',
  v => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères'
]

// Fonction de connexion
const handleLogin = async () => {
  loading.value = true
  
  try {
    // Authentification avec Supabase
    const result = await authHelpers.signIn(email.value, password.value)
    
    if (result.user) {
      showNotification('Connexion réussie ! Bienvenue dans Tech4Good', 'success')
      
      // Sauvegarder les données utilisateur avec le rôle du profil
      const userData = {
        id: result.user.id,
        email: result.user.email,
        name: result.profile ? `${result.profile.first_name} ${result.profile.last_name}` : result.user.email,
        firstName: result.profile?.first_name || '',
        lastName: result.profile?.last_name || '',
        role: result.profile?.role || 'Nouvel arrivant', // Rôle depuis la table profiles
        isAuthenticated: true
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('Utilisateur connecté:', userData)
      console.log('Rôle utilisateur:', userData.role)
      
      // Redirection vers l'accueil
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
    
  } catch (error) {
    console.error('Erreur connexion:', error)
    let errorMessage = 'Erreur lors de la connexion'
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Email ou mot de passe incorrect'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Veuillez confirmer votre email avant de vous connecter'
    }
    
    showNotification(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

// Fonction de réinitialisation du mot de passe
const handleResetPassword = () => {
  if (resetEmail.value && /.+@.+\..+/.test(resetEmail.value)) {
    showNotification('Email de réinitialisation envoyé !', 'success')
    showForgotPassword.value = false
    resetEmail.value = ''
  } else {
    showNotification('Veuillez entrer une adresse email valide', 'error')
  }
}

// Remplir les identifiants de démonstration
const fillDemoCredentials = () => {
  email.value = 'demo@tech4good.fr'
  password.value = 'demo123'
  showNotification('Identifiants de démonstration remplis', 'info')
}

// Fonction pour afficher les notifications
const showNotification = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-background {
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-credentials {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 600px) {
  .login-background {
    padding: 10px;
  }
  
  .login-card {
    margin-top: 20px;
  }
}
</style>