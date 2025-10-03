<template>
  <v-app-bar 
    app 
    fixed 
    color="primary" 
    elevation="4"
    height="80"
  >
    <v-container fluid class="d-flex align-center pa-0">
      <!-- Logo -->
      <router-link to="/" class="text-decoration-none">
        <v-toolbar-title class="text-white font-weight-bold">
          <v-icon class="mr-2" color="white">mdi-earth</v-icon>
          Tech4Good
        </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <!-- Navigation Desktop -->
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn 
          v-for="item in navItems" 
          :key="item.to"
          :to="item.to"
          variant="text"
          class="mx-1 text-white"
          :prepend-icon="item.icon"
        >
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <!-- Déconnexion et profil -->
      <v-toolbar-items class="d-none d-md-flex ml-4">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="text-white"
            >
              <v-avatar size="32" color="white" class="mr-2">
                <span class="text-body-2 font-weight-bold text-primary">{{ userInitials }}</span>
              </v-avatar>
              {{ fullName }}
              <v-icon class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$router.push('/profile')">
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title>Mon profil</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <!-- Menu mobile -->
      <v-app-bar-nav-icon 
        class="d-md-none" 
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-container>
  </v-app-bar>

  <!-- Drawer mobile -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    width="280"
  >
    <v-list>
      <v-list-item class="pa-4">
        <template v-slot:prepend>
          <v-avatar color="primary" class="mr-3">
            <span class="text-body-1 font-weight-bold text-white">{{ userInitials }}</span>
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-medium">{{ fullName }}</v-list-item-title>
        <v-list-item-subtitle>{{ userRole }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="drawer = false"
      ></v-list-item>
      
      <v-divider class="my-2"></v-divider>
      
      <v-list-item
        @click="logout"
        prepend-icon="mdi-logout"
        title="Se déconnecter"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser.js'

const router = useRouter()
const drawer = ref(false)

// Utiliser le composable centralisé pour l'utilisateur
const { fullName, userInitials, userRole, logout: userLogout } = useUser()

const navItems = [
  { title: 'Accueil', to: '/', icon: 'mdi-home' },
  { title: 'Calendrier', to: '/calendrier', icon: 'mdi-calendar' }
]

// Fonction de déconnexion
const logout = async () => {
  try {
    console.log('Déconnexion en cours...')
    
    // Utiliser la fonction logout du composable
    await userLogout()
    
    console.log('Déconnexion réussie')
    
    // Rediriger vers la page de login
    router.push('/login')
    
    // Fermer le drawer mobile si ouvert
    drawer.value = false
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // En cas d'erreur, on redirige quand même
    router.push('/login')
    drawer.value = false
  }
}
</script>