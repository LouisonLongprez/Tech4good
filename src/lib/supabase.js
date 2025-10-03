import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions pour l'authentification
export const authHelpers = {
  // Inscription avec profil
  async signUpWithProfile(userData) {
    try {
      // 1. Créer le compte utilisateur avec Supabase Auth (sans confirmation email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: undefined, // Pas de redirection email
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role
          }
        }
      })

      if (authError) {
        throw authError
      }

      // 2. Si l'utilisateur est créé, créer le profil immédiatement
      if (authData.user) {
        // Attendre un peu pour que l'utilisateur soit bien créé
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: userData.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              role: userData.role
            }
          ])
          .select()
          .single()

        if (profileError) {
          console.error('Erreur création profil:', profileError)
          // Ne pas bloquer si le profil échoue - l'utilisateur peut quand même se connecter
        }

        console.log('✅ Utilisateur créé:', authData.user.id)
        console.log('✅ Profil créé:', profileData)

        // Créer les documents de base pour le nouvel utilisateur
        await this.createBaseDocuments(authData.user.id)

        return {
          user: authData.user,
          profile: profileData,
          session: authData.session,
          needsConfirmation: false
        }
      }

      throw new Error('Échec de la création du compte')
    } catch (error) {
      console.error('Erreur signUpWithProfile:', error)
      throw error
    }
  },

  // Connexion
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      // Récupérer le profil utilisateur après connexion
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.warn('Profil non trouvé, création automatique...')
          // Créer le profil s'il n'existe pas
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              first_name: data.user.user_metadata?.first_name || '',
              last_name: data.user.user_metadata?.last_name || '',
              role: data.user.user_metadata?.role || 'Nouvel arrivant'
            })
            .select()
            .single()
          
          return { ...data, profile: newProfile }
        }

        return { ...data, profile }
      }

      return data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  },

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      return true
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  },

  // Récupérer l'utilisateur actuel avec son profil
  async getCurrentUserWithProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        return { user, profile: null }
      }

      return { user, profile }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      return null
    }
  },

  // Mettre à jour le profil
  async updateProfile(updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Utilisateur non connecté')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

      if (error) {
        throw error
      }

      return data[0]
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  },

  // Vérifier l'état de l'authentification
  async checkAuthState() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        return {
          isAuthenticated: true,
          user: session.user,
          profile: profile,
          session: session
        }
      }

      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        session: null
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        session: null
      }
    }
  },

  // === FONCTIONS D'INITIALISATION ===
  // Créer les documents de base pour un nouvel utilisateur
  async createBaseDocuments(userId) {
    try {
      const baseDocuments = [
        {
          document_name: 'Contrat de travail Tech4Good',
          document_type: 'contract'
        },
        {
          document_name: 'Guide d\'accueil et onboarding',
          document_type: 'guide'
        },
        {
          document_name: 'Politique de confidentialité',
          document_type: 'other'
        }
      ]

      for (const doc of baseDocuments) {
        await supabase
          .from('user_documents')
          .insert({
            user_id: userId,
            ...doc
          })
      }

      console.log('✅ Documents de base créés pour l\'utilisateur')
      return true
    } catch (error) {
      console.error('Erreur création documents de base:', error)
      return false
    }
  },

  // === FONCTIONS QUIZ ===
  // Sauvegarder un résultat de quiz
  async saveQuizResult(quizData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { data, error } = await supabase
        .from('user_quiz_progress')
        .insert({
          user_id: user.id,
          quiz_category: quizData.category,
          quiz_title: quizData.title,
          score: quizData.score,
          total_questions: quizData.totalQuestions,
          correct_answers: quizData.correctAnswers,
          answers: quizData.answers
        })
        .select()

      if (error) throw error
      console.log(`✅ Quiz "${quizData.title}" sauvegardé: ${quizData.score}%`)
      return data[0]
    } catch (error) {
      console.error('Erreur sauvegarde quiz:', error)
      throw error
    }
  },

  // Récupérer les statistiques de quiz de l'utilisateur
  async getUserQuizStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { completedQuizzes: 0, averageScore: 0, totalPoints: 0 }

      const { data, error } = await supabase
        .from('user_quiz_progress')
        .select('score, correct_answers, total_questions')
        .eq('user_id', user.id)

      if (error) throw error

      const completedQuizzes = data?.length || 0
      const totalPoints = data?.reduce((sum, quiz) => sum + quiz.correct_answers, 0) || 0
      const averageScore = completedQuizzes > 0 
        ? Math.round(data.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes) 
        : 0

      return { completedQuizzes, averageScore, totalPoints }
    } catch (error) {
      console.error('Erreur récupération stats quiz:', error)
      return { completedQuizzes: 0, averageScore: 0, totalPoints: 0 }
    }
  },

  // Récupérer l'historique des quiz
  async getQuizHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_quiz_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération historique quiz:', error)
      return []
    }
  },

  // === FONCTIONS FORMATIONS ===
  // Sauvegarder la progression d'une formation
  async saveFormationProgress(formationId, formationTitle, status, progress = 0) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const updateData = {
        user_id: user.id,
        formation_id: formationId.toString(),
        formation_title: formationTitle,
        status: status,
        progress: progress
      }

      // Ajouter les timestamps selon le statut
      if (status === 'registered') {
        updateData.registered_at = new Date().toISOString()
      }
      if (status === 'in_progress') {
        updateData.started_at = new Date().toISOString()
      }
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
        updateData.progress = 100
      }

      const { data, error } = await supabase
        .from('user_formations')
        .upsert(updateData, { onConflict: 'user_id,formation_id' })
        .select()

      if (error) throw error
      console.log(`✅ Formation "${formationTitle}" mise à jour: ${status} (${progress}%)`)
      return data[0]
    } catch (error) {
      console.error('Erreur sauvegarde formation:', error)
      throw error
    }
  },

  // Récupérer les statistiques de formations de l'utilisateur
  async getUserFormationsStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { completed: 0, inProgress: 0, registered: 0 }

      const { data, error } = await supabase
        .from('user_formations')
        .select('status')
        .eq('user_id', user.id)

      if (error) throw error

      const stats = data?.reduce((acc, formation) => {
        acc[formation.status] = (acc[formation.status] || 0) + 1
        return acc
      }, {}) || {}

      return {
        completed: stats.completed || 0,
        inProgress: stats.in_progress || 0,
        registered: stats.registered || 0
      }
    } catch (error) {
      console.error('Erreur récupération stats formations:', error)
      return { completed: 0, inProgress: 0, registered: 0 }
    }
  },

  // Récupérer toutes les formations de l'utilisateur
  async getUserFormations() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_formations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération formations:', error)
      return []
    }
  },

  // === FONCTIONS ÉVÉNEMENTS ===
  // Sauvegarder un événement utilisateur
  async saveUserEvent(eventData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { data, error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          description: eventData.description || null,
          start_date: eventData.start_date,
          end_date: eventData.end_date || null,
          location: eventData.location || null,
          event_type: eventData.event_type || 'meeting'
        })
        .select()

      if (error) throw error
      console.log(`✅ Événement "${eventData.title}" créé`)
      return data[0]
    } catch (error) {
      console.error('Erreur sauvegarde événement:', error)
      throw error
    }
  },

  // Récupérer les événements de l'utilisateur
  async getUserEvents() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération événements:', error)
      return []
    }
  },

  // Supprimer un événement
  async deleteUserEvent(eventId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { error } = await supabase
        .from('user_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id)

      if (error) throw error
      console.log(`✅ Événement supprimé`)
      return true
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      throw error
    }
  },

  // === FONCTIONS DOCUMENTS ===
  // Sauvegarder un document utilisateur
  async saveUserDocument(documentData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          document_name: documentData.name,
          document_type: documentData.type,
          file_path: documentData.filePath || null,
          file_size: documentData.fileSize || null,
          mime_type: documentData.mimeType || null
        })
        .select()

      if (error) throw error
      console.log(`✅ Document "${documentData.name}" sauvegardé`)
      return data[0]
    } catch (error) {
      console.error('Erreur sauvegarde document:', error)
      throw error
    }
  },

  // Récupérer les documents de l'utilisateur
  async getUserDocuments(documentType = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      let query = supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)

      if (documentType) {
        query = query.eq('document_type', documentType)
      }

      const { data, error } = await query.order('uploaded_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur récupération documents:', error)
      return []
    }
  },

  // === FONCTIONS PARAMÈTRES ===
  // Récupérer les paramètres utilisateur
  async getUserSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Erreur récupération paramètres:', error)
      return null
    }
  },

  // Mettre à jour les paramètres utilisateur
  async updateUserSettings(settings) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        })
        .select()

      if (error) throw error
      console.log(`✅ Paramètres mis à jour`)
      return data[0]
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error)
      throw error
    }
  },

  // === STATISTIQUES GLOBALES ===
  // Récupérer toutes les statistiques utilisateur d'un coup
  async getAllUserStats() {
    try {
      const [quizStats, formationStats, events, documents] = await Promise.all([
        this.getUserQuizStats(),
        this.getUserFormationsStats(),
        this.getUserEvents(),
        this.getUserDocuments()
      ])

      return {
        quiz: quizStats,
        formations: formationStats,
        eventsCount: events.length,
        documentsCount: documents.length,
        lastActivity: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur récupération stats globales:', error)
      return {
        quiz: { completedQuizzes: 0, averageScore: 0, totalPoints: 0 },
        formations: { completed: 0, inProgress: 0, registered: 0 },
        eventsCount: 0,
        documentsCount: 0,
        lastActivity: new Date().toISOString()
      }
    }
  }
}
