<template>
  <v-app>
    <!-- Navigation conditionnelle -->
    <Navigation v-if="!hideNavigation" />
    
    <!-- Contenu principal -->
    <v-main :class="{ 'with-navigation': !hideNavigation, 'without-navigation': hideNavigation }">
      <div class="fill-height">
        <router-view />
      </div>
    </v-main>
    
    <!-- Footer conditionnel -->
    <v-footer v-if="!hideNavigation" app color="surface" class="text-center">
      <v-container>
        <span>&copy; 2025 Tech4Good - Plateforme d'onboarding</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from './Navigation.vue'

const route = useRoute()

// Cacher la navigation sur les pages d'authentification
const hideNavigation = computed(() => {
  return route.meta?.hideNavigation || false
})
</script>

<style scoped>
.with-navigation {
  padding-top: 80px !important;
  width: 100%;
}

.without-navigation {
  padding-top: 0 !important;
  width: 100%;
}

.fill-height {
  width: 100%;
  min-height: calc(100vh - 80px);
}

.without-navigation .fill-height {
  min-height: 100vh;
}
</style>
