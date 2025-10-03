<template>
  <div class="reset-password-page">
    <!-- Background avec gradient -->
    <div class="reset-background">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <!-- Carte de réinitialisation -->
            <v-card class="reset-card" elevation="12">
              <!-- Header avec logo -->
              <v-card-text class="text-center pa-8">
                <div class="mb-6">
                  <v-avatar size="80" color="primary" class="mb-4">
                    <v-icon size="40" color="white">mdi-lock-reset</v-icon>
                  </v-avatar>
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">Mot de passe oublié</h1>
                  <p class="text-h6 text-medium-emphasis">Réinitialisez votre mot de passe</p>
                </div>

                <!-- Étape 1: Demande d'email -->
                <div v-if="step === 1">
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    Entrez votre adresse email pour recevoir un code de vérification.
                  </p>

                  <v-form @submit.prevent="sendResetCode" ref="emailForm">
                    <v-text-field
                      v-model="email"
                      label="Adresse email"
                      prepend-inner-icon="mdi-email"
                      variant="outlined"
                      :rules="emailRules"
                      class="mb-4"
                      required
                    ></v-text-field>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      class="mb-4"
                      :loading="loading"
                    >
                      Envoyer le code
                    </v-btn>
                  </v-form>
                </div>

                <!-- Étape 2: Vérification du code -->
                <div v-if="step === 2">
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    Un code de vérification a été envoyé à {{ email }}
                  </p>

                  <v-form @submit.prevent="verifyCode" ref="codeForm">
                    <v-text-field
                      v-model="verificationCode"
                      label="Code de vérification"
                      prepend-inner-icon="mdi-numeric"
                      variant="outlined"
                      :rules="codeRules"
                      class="mb-4"
                      required
                    ></v-text-field>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      class="mb-4"
                      :loading="loading"
                    >
                      Vérifier le code
                    </v-btn>

                    <v-btn
                      variant="text"
                      color="primary"
                      size="small"
                      @click="resendCode"
                      :disabled="resendDisabled"
                    >
                      Renvoyer le code {{ resendCountdown > 0 ? `(${resendCountdown}s)` : '' }}
                    </v-btn>
                  </v-form>
                </div>

                <!-- Étape 3: Nouveau mot de passe -->
                <div v-if="step === 3">
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    Créez un nouveau mot de passe sécurisé.
                  </p>

                  <v-form @submit.prevent="resetPassword" ref="passwordForm">
                    <v-text-field
                      v-model="newPassword"
                      label="Nouveau mot de passe"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      variant="outlined"
                      :rules="passwordRules"
                      class="mb-4"
                      required
                      @click:append-inner="showPassword = !showPassword"
                    ></v-text-field>

                    <v-text-field
                      v-model="confirmPassword"
                      label="Confirmer le mot de passe"
                      prepend-inner-icon="mdi-lock-check"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      variant="outlined"
                      :rules="confirmPasswordRules"
                      class="mb-4"
                      required
                      @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    ></v-text-field>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      class="mb-4"
                      :loading="loading"
                    >
                      Réinitialiser le mot de passe
                    </v-btn>
                  </v-form>
                </div>

                <!-- Lien retour à la connexion -->
                <div class="mt-6 text-center">
                  <p class="text-body-2 text-medium-emphasis">
                    Vous vous souvenez de votre mot de passe ?
                    <v-btn
                      variant="text"
                      color="primary"
                      @click="$router.push('/login')"
                      class="pa-0"
                    >
                      Se connecter
                    </v-btn>
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

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
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État du formulaire
const step = ref(1)
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const resendCountdown = ref(0)
const resendInterval = ref(null)

// Notifications
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Computed
const resendDisabled = computed(() => resendCountdown.value > 0)

// Règles de validation
const emailRules = [
  v => !!v || 'Email requis',
  v => /.+@.+\..+/.test(v) || 'Email invalide'
]

const codeRules = [
  v => !!v || 'Code requis',
  v => /^\d{6}$/.test(v) || 'Le code doit contenir 6 chiffres'
]

const passwordRules = [
  v => !!v || 'Mot de passe requis',
  v => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères',
  v => /(?=.*[a-z])/.test(v) || 'Au moins une lettre minuscule',
  v => /(?=.*[A-Z])/.test(v) || 'Au moins une lettre majuscule',
  v => /(?=.*\d)/.test(v) || 'Au moins un chiffre'
]

const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirmation requise',
  v => v === newPassword.value || 'Les mots de passe ne correspondent pas'
])

// Fonctions
const sendResetCode = async () => {
  loading.value = true
  
  try {
    // Simulation d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showNotification('Code de vérification envoyé !', 'success')
    step.value = 2
    startResendCountdown()
    
  } catch (error) {
    showNotification('Erreur lors de l\'envoi du code', 'error')
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  loading.value = true
  
  try {
    // Simulation de vérification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Code démo: 123456
    if (verificationCode.value === '123456') {
      showNotification('Code vérifié avec succès !', 'success')
      step.value = 3
    } else {
      showNotification('Code incorrect', 'error')
    }
    
  } catch (error) {
    showNotification('Erreur lors de la vérification', 'error')
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  loading.value = true
  
  try {
    // Simulation de réinitialisation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showNotification('Mot de passe réinitialisé avec succès !', 'success')
    
    // Redirection vers la page de login
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    showNotification('Erreur lors de la réinitialisation', 'error')
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (resendDisabled.value) return
  
  loading.value = true
  
  try {
    // Simulation de renvoi
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showNotification('Code renvoyé !', 'success')
    startResendCountdown()
    
  } catch (error) {
    showNotification('Erreur lors du renvoi', 'error')
  } finally {
    loading.value = false
  }
}

const startResendCountdown = () => {
  resendCountdown.value = 60
  resendInterval.value = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(resendInterval.value)
    }
  }, 1000)
}

const showNotification = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Cleanup
onUnmounted(() => {
  if (resendInterval.value) {
    clearInterval(resendInterval.value)
  }
})
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.reset-background {
  min-height: 100vh;
  padding: 20px;
}

.reset-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
  .reset-background {
    padding: 10px;
  }
  
  .reset-card {
    margin-top: 20px;
  }
}
</style>
