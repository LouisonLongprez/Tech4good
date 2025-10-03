<template>
  <div class="register-page">
    <!-- Background avec gradient -->
    <div class="register-background">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="5" xl="4">
            <!-- Carte d'inscription -->
            <v-card class="register-card" elevation="12">
              <!-- Header avec logo -->
              <v-card-text class="text-center pa-8">
                <div class="mb-6">
                  <v-avatar size="80" color="primary" class="mb-4">
                    <v-icon size="40" color="white">mdi-earth</v-icon>
                  </v-avatar>
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">Rejoindre Tech4Good</h1>
                  <p class="text-h6 text-medium-emphasis">Créez votre compte pour commencer</p>
                </div>

                <!-- Formulaire d'inscription -->
                <v-form @submit.prevent="handleRegister" ref="registerForm">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="firstName"
                        label="Prénom"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        :rules="nameRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="lastName"
                        label="Nom"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        :rules="nameRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="email"
                    label="Email professionnel"
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

                  <v-select
                    v-model="role"
                    :items="roles"
                    label="Votre rôle"
                    prepend-inner-icon="mdi-account-group"
                    variant="outlined"
                    :rules="[v => !!v || 'Rôle requis']"
                    class="mb-6"
                    required
                  ></v-select>

                  <!-- Conditions d'utilisation -->
                  <v-checkbox
                    v-model="acceptTerms"
                    :rules="[v => !!v || 'Vous devez accepter les conditions']"
                    class="mb-4"
                    required
                  >
                    <template v-slot:label>
                      <span class="text-body-2">
                        J'accepte les 
                        <a @click="showTerms = true" class="text-primary cursor-pointer">conditions d'utilisation</a>
                        et la 
                        <a @click="showPrivacy = true" class="text-primary cursor-pointer">politique de confidentialité</a>
                      </span>
                    </template>
                  </v-checkbox>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    class="mb-4"
                    :loading="loading"
                  >
                    Créer mon compte
                  </v-btn>
                </v-form>

                <!-- Lien de connexion -->
                <div class="mt-6 text-center">
                  <p class="text-body-2 text-medium-emphasis">
                    Déjà un compte ?
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

    <!-- Modal Conditions d'utilisation -->
    <v-dialog v-model="showTerms" max-width="800" scrollable>
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-file-document-outline</v-icon>
          Conditions d'utilisation
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px;">
          <div class="terms-content">
            <h3>1. Acceptation des conditions</h3>
            <p>En accédant et en utilisant la plateforme Tech4Good, vous acceptez d'être lié par ces conditions d'utilisation.</p>
            
            <h3>2. Description du service</h3>
            <p>Tech4Good est une plateforme d'onboarding destinée à faciliter l'intégration des nouveaux collaborateurs dans l'entreprise.</p>
            
            <h3>3. Compte utilisateur</h3>
            <p>Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion et de toutes les activités qui se produisent sous votre compte.</p>
            
            <h3>4. Utilisation acceptable</h3>
            <p>Vous vous engagez à utiliser la plateforme de manière respectueuse et conforme aux politiques de l'entreprise.</p>
            
            <h3>5. Propriété intellectuelle</h3>
            <p>Tout le contenu de la plateforme reste la propriété de Tech4Good et est protégé par les lois sur la propriété intellectuelle.</p>
            
            <h3>6. Confidentialité</h3>
            <p>Vous vous engagez à ne pas divulguer d'informations confidentielles auxquelles vous pourriez avoir accès via la plateforme.</p>
            
            <h3>7. Modifications</h3>
            <p>Tech4Good se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés des changements importants.</p>
            
            <h3>8. Résiliation</h3>
            <p>Tech4Good peut suspendre ou résilier votre accès à la plateforme en cas de violation de ces conditions.</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showTerms = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Politique de confidentialité -->
    <v-dialog v-model="showPrivacy" max-width="800" scrollable>
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-shield-account</v-icon>
          Politique de confidentialité
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px;">
          <div class="privacy-content">
            <h3>1. Collecte des données</h3>
            <p>Nous collectons les informations que vous nous fournissez directement, telles que votre nom, email, et rôle dans l'entreprise lors de votre inscription.</p>
            
            <h3>2. Utilisation des données</h3>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul>
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Personnaliser votre expérience d'onboarding</li>
              <li>Vous fournir un support technique</li>
              <li>Améliorer nos services</li>
            </ul>
            
            <h3>3. Partage des données</h3>
            <p>Nous ne vendons, n'échangeons et ne louons pas vos informations personnelles à des tiers. Vos données peuvent être partagées uniquement :</p>
            <ul>
              <li>Avec votre consentement explicite</li>
              <li>Pour des raisons légales ou réglementaires</li>
              <li>Avec les équipes RH de l'entreprise dans le cadre de votre onboarding</li>
            </ul>
            
            <h3>4. Sécurité des données</h3>
            <p>Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisé.</p>
            
            <h3>5. Conservation des données</h3>
            <p>Vos données personnelles sont conservées aussi longtemps que nécessaire pour les finalités pour lesquelles elles ont été collectées, ou selon les exigences légales.</p>
            
            <h3>6. Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            
            <h3>7. Contact</h3>
            <p>Pour exercer vos droits ou pour toute question concernant cette politique, contactez-nous à : privacy@tech4good.fr</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showPrivacy = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authHelpers } from '../lib/supabase.js'

const router = useRouter()

// État du formulaire
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

// Notifications
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Options des select
const roles = [
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

const passwordRules = [
  v => !!v || 'Mot de passe requis',
  v => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères',
  v => /(?=.*[a-z])/.test(v) || 'Au moins une lettre minuscule',
  v => /(?=.*[A-Z])/.test(v) || 'Au moins une lettre majuscule',
  v => /(?=.*\d)/.test(v) || 'Au moins un chiffre'
]

const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirmation requise',
  v => v === password.value || 'Les mots de passe ne correspondent pas'
])

// Fonction d'inscription
const handleRegister = async () => {
  loading.value = true
  
  try {
    // Créer le compte avec Supabase (inscription directe sans email)
    const result = await authHelpers.signUpWithProfile({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      role: role.value
    })

    if (result.user) {
      console.log('✅ Compte créé avec succès:', {
        userId: result.user.id,
        email: result.user.email,
        profile: result.profile
      })

      showNotification('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success')
      
      // Redirection immédiate vers la page de login
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    
  } catch (error) {
    console.error('❌ Erreur inscription:', error)
    let errorMessage = 'Erreur lors de la création du compte'
    
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      errorMessage = 'Cette adresse email est déjà utilisée'
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Adresse email invalide'
    } else if (error.message.includes('Password') || error.message.includes('weak password')) {
      errorMessage = 'Le mot de passe doit contenir au moins 6 caractères'
    } else if (error.message.includes('duplicate key')) {
      errorMessage = 'Un compte avec cet email existe déjà'
    }
    
    showNotification(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}

// Fonction pour afficher les notifications
const showNotification = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.register-background {
  min-height: 100vh;
  padding: 20px;
}

.register-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.terms-content h3,
.privacy-content h3 {
  color: #1d4ed8;
  margin-top: 16px;
  margin-bottom: 8px;
}

.terms-content p,
.privacy-content p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.terms-content ul,
.privacy-content ul {
  margin-left: 20px;
  margin-bottom: 12px;
}

.terms-content li,
.privacy-content li {
  margin-bottom: 4px;
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 600px) {
  .register-background {
    padding: 10px;
  }
  
  .register-card {
    margin-top: 20px;
  }
}
</style>
