import { createRouter, createWebHistory } from 'vue-router'
import { authHelpers } from './lib/supabase.js'

// Fonction pour vérifier l'authentification avec Supabase
const requireAuth = async (to, from, next) => {
  try {
    const authState = await authHelpers.checkAuthState()
    
    if (authState.isAuthenticated) {
      // Sauvegarder les infos utilisateur dans localStorage pour l'UI
      const userData = {
        id: authState.user.id,
        email: authState.user.email,
        name: authState.profile ? `${authState.profile.first_name} ${authState.profile.last_name}` : authState.user.email,
        firstName: authState.profile?.first_name || '',
        lastName: authState.profile?.last_name || '',
        role: authState.profile?.role || 'Nouvel arrivant',
        isAuthenticated: true
      }
      localStorage.setItem('user', JSON.stringify(userData))
      next()
    } else {
      localStorage.removeItem('user')
      next('/login')
    }
  } catch (error) {
    console.error('Erreur vérification auth:', error)
    localStorage.removeItem('user')
    next('/login')
  }
}

const routes = [
  // Pages publiques (sans authentification)
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('./components/Login.vue'),
    meta: { 
      hideNavigation: true,
      title: 'Connexion - Tech4Good'
    }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: () => import('./components/Register.vue'),
    meta: { 
      hideNavigation: true,
      title: 'Inscription - Tech4Good'
    }
  },
  { 
    path: '/reset-password', 
    name: 'ResetPassword', 
    component: () => import('./components/ResetPassword.vue'),
    meta: { 
      hideNavigation: true,
      title: 'Réinitialisation - Tech4Good'
    }
  },

  // Pages protégées (avec authentification)
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('./components/Home.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Accueil - Tech4Good' }
  },
  { 
    path: '/calendrier', 
    name: 'Calendrier', 
    component: () => import('./components/Calendar.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Calendrier - Tech4Good' }
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('./components/Profile.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Profil - Tech4Good' }
  },
  { 
    path: '/formations', 
    name: 'Formations', 
    component: () => import('./components/Formations.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Formations - Tech4Good' }
  },
  { 
    path: '/quiz', 
    name: 'Quiz', 
    component: () => import('./components/Quiz.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Quiz - Tech4Good' }
  },
  { 
    path: '/escape-game', 
    name: 'EscapeGame', 
    component: () => import('./components/EscapeGame.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Escape Game - Tech4Good' }
  },
  { 
    path: '/mentorat', 
    name: 'Mentorat', 
    component: () => import('./components/Mentorat.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Mentorat - Tech4Good' }
  },
  { 
    path: '/chat', 
    name: 'Chat', 
    component: () => import('./components/Chat.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Chat - Tech4Good' }
  },
  { 
    path: '/blog', 
    name: 'Blog', 
    component: () => import('./components/Blog.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Blog - Tech4Good' }
  },
  { 
    path: '/community', 
    name: 'Community', 
    component: () => import('./components/Community.vue'),
    beforeEnter: requireAuth,
    meta: { title: 'Communauté - Tech4Good' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware pour gérer les titres de page
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
