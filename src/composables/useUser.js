import { ref, computed, onMounted } from 'vue'
import { authHelpers } from '../lib/supabase.js'

// État global de l'utilisateur (singleton)
const currentUser = ref(null)
const isLoading = ref(false)

export function useUser() {
  // Charger les données utilisateur depuis localStorage ou Supabase
  const loadUser = async () => {
    isLoading.value = true
    
    try {
      // D'abord, essayer de récupérer depuis localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        currentUser.value = JSON.parse(userData)
      }
      
      // Puis vérifier l'état de l'authentification avec Supabase
      const authState = await authHelpers.checkAuthState()
      
      if (authState.isAuthenticated && authState.profile) {
        const freshUserData = {
          id: authState.user.id,
          email: authState.user.email,
          firstName: authState.profile.first_name || '',
          lastName: authState.profile.last_name || '',
          name: `${authState.profile.first_name} ${authState.profile.last_name}`,
          role: authState.profile.role || 'Nouvel arrivant',
          isAuthenticated: true,
          createdAt: authState.profile.created_at,
          updatedAt: authState.profile.updated_at
        }
        
        // Mettre à jour les données utilisateur
        currentUser.value = freshUserData
        localStorage.setItem('user', JSON.stringify(freshUserData))
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error)
      currentUser.value = null
      localStorage.removeItem('user')
    } finally {
      isLoading.value = false
    }
  }

  // Mettre à jour le profil utilisateur
  const updateUser = async (updates) => {
    if (!currentUser.value) return

    try {
      isLoading.value = true
      
      // Mettre à jour dans Supabase
      const result = await authHelpers.updateProfile(updates)
      
      if (result) {
        // Mettre à jour les données locales
        const updatedUser = {
          ...currentUser.value,
          firstName: updates.first_name || currentUser.value.firstName,
          lastName: updates.last_name || currentUser.value.lastName,
          name: `${updates.first_name || currentUser.value.firstName} ${updates.last_name || currentUser.value.lastName}`,
          role: updates.role || currentUser.value.role,
          updatedAt: new Date().toISOString()
        }
        
        currentUser.value = updatedUser
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return result
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Déconnecter l'utilisateur
  const logout = async () => {
    try {
      await authHelpers.signOut()
      currentUser.value = null
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Forcer la déconnexion locale même en cas d'erreur
      currentUser.value = null
      localStorage.removeItem('user')
    }
  }

  // Computed properties
  const fullName = computed(() => {
    if (currentUser.value && currentUser.value.firstName && currentUser.value.lastName) {
      return `${currentUser.value.firstName} ${currentUser.value.lastName}`
    }
    return currentUser.value?.name || currentUser.value?.email || 'Utilisateur'
  })

  const userInitials = computed(() => {
    if (currentUser.value && currentUser.value.firstName && currentUser.value.lastName) {
      return `${currentUser.value.firstName.charAt(0)}${currentUser.value.lastName.charAt(0)}`.toUpperCase()
    }
    if (currentUser.value?.name) {
      const names = currentUser.value.name.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      }
      return names[0].charAt(0).toUpperCase()
    }
    return 'U'
  })

  const userRole = computed(() => {
    return currentUser.value?.role || 'Nouvel arrivant'
  })

  const userEmail = computed(() => {
    return currentUser.value?.email || ''
  })

  const isAuthenticated = computed(() => {
    return currentUser.value?.isAuthenticated || false
  })

  const firstName = computed(() => {
    return currentUser.value?.firstName || ''
  })

  const lastName = computed(() => {
    return currentUser.value?.lastName || ''
  })

  const joinDate = computed(() => {
    if (currentUser.value?.createdAt) {
      return new Date(currentUser.value.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    })
  })

  // Calculer les jours restants dans la période d'onboarding (6 mois)
  const daysRemaining = computed(() => {
    if (currentUser.value?.createdAt) {
      const createdDate = new Date(currentUser.value.createdAt)
      const endDate = new Date(createdDate)
      endDate.setMonth(endDate.getMonth() + 6) // Ajouter 6 mois
      
      const today = new Date()
      const timeDiff = endDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      return Math.max(0, daysDiff) // Ne jamais retourner négatif
    }
    
    // Par défaut, si pas de date de création, on considère 6 mois complets
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    const timeDiff = sixMonthsFromNow.getTime() - new Date().getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  })

  // Calculer le pourcentage de progression dans l'onboarding
  const onboardingProgress = computed(() => {
    if (currentUser.value?.createdAt) {
      const createdDate = new Date(currentUser.value.createdAt)
      const endDate = new Date(createdDate)
      endDate.setMonth(endDate.getMonth() + 6)
      
      const today = new Date()
      const totalDays = (endDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)
      const daysPassed = (today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)
      
      const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100))
      return Math.round(progress)
    }
    return 0
  })

  const userCreatedAt = computed(() => {
    return currentUser.value?.createdAt || null
  })

  // Auto-charger au montage si pas encore chargé
  onMounted(() => {
    if (!currentUser.value) {
      loadUser()
    }
  })

  return {
    // État
    currentUser,
    isLoading,
    
    // Computed properties
    fullName,
    userInitials,
    userRole,
    userEmail,
    isAuthenticated,
    firstName,
    lastName,
    joinDate,
    daysRemaining,
    onboardingProgress,
    userCreatedAt,
    
    // Méthodes
    loadUser,
    updateUser,
    logout
  }
}