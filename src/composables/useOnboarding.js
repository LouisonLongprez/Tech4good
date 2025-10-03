import { computed } from 'vue'
import { useUser } from './useUser.js'

export function useOnboarding() {
  const { currentUser, daysRemaining, onboardingProgress } = useUser()

  // Calculer la phase d'onboarding actuelle
  const currentPhase = computed(() => {
    const progress = onboardingProgress.value
    
    if (progress <= 16) return 1 // Semaines 1-2: Arrivée & Découverte
    if (progress <= 33) return 2 // Semaines 3-6: Formation & Intégration  
    if (progress <= 50) return 3 // Mois 2-3: Montée en compétences
    if (progress <= 66) return 4 // Mois 4: Projets autonomes
    if (progress <= 83) return 5 // Mois 5: Mentoring inversé
    return 6 // Mois 6: Bilan & perspectives
  })

  // Messages d'encouragement basés sur la progression
  const motivationalMessage = computed(() => {
    const phase = currentPhase.value
    const days = daysRemaining.value
    
    const messages = {
      1: `🚀 Bienvenue ! Vous avez ${days} jours pour votre parcours d'intégration`,
      2: `🎓 Vous progressez bien ! ${days} jours restants pour maîtriser les outils`,
      3: `💪 Belle évolution ! ${days} jours pour développer votre autonomie`,
      4: `🌟 Excellent ! ${days} jours pour devenir expert dans votre domaine`,
      5: `🤝 Impressionnant ! ${days} jours pour partager vos connaissances`,
      6: `🎯 Bravo ! ${days} jours pour finaliser votre intégration`
    }
    
    return messages[phase] || `🎉 Félicitations pour votre progression !`
  })

  // Objectifs de la phase actuelle
  const currentObjectives = computed(() => {
    const phase = currentPhase.value
    
    const objectives = {
      1: [
        'Signer le contrat et s\'installer',
        'Rencontrer l\'équipe',
        'Découvrir l\'environnement de travail',
        'Comprendre la mission Tech4Good'
      ],
      2: [
        'Maîtriser les outils internes',
        'Comprendre les processus métier',
        'Réaliser premier projet avec mentor',
        'Valider les acquis par des quiz'
      ],
      3: [
        'Gagner en autonomie sur les projets',
        'Approfondir les compétences techniques',
        'Choisir une spécialisation',
        'Participer activement aux réunions'
      ],
      4: [
        'Mener des projets en autonomie complète',
        'Devenir référent dans un domaine',
        'Contribuer aux décisions techniques',
        'Initier des améliorations'
      ],
      5: [
        'Mentorer les nouveaux arrivants',
        'Animer des formations internes',
        'Partager expertise et bonnes pratiques',
        'Contribuer au recrutement'
      ],
      6: [
        'Finaliser tous les objectifs',
        'Préparer le bilan d\'intégration',
        'Définir les perspectives d\'évolution',
        'Devenir ambassadeur Tech4Good'
      ]
    }
    
    return objectives[phase] || []
  })

  // Prochaines étapes recommandées
  const nextSteps = computed(() => {
    const progress = onboardingProgress.value
    
    if (progress < 20) {
      return [
        'Terminer les formations de base',
        'Planifier rendez-vous avec mentor',
        'Explorer la plateforme d\'apprentissage'
      ]
    } else if (progress < 50) {
      return [
        'Identifier un projet personnel',
        'Approfondir une compétence technique',
        'Rejoindre une communauté interne'
      ]
    } else if (progress < 80) {
      return [
        'Proposer une amélioration',
        'Prendre initiative sur un projet',
        'Préparer une présentation technique'
      ]
    } else {
      return [
        'Finaliser le bilan d\'intégration',
        'Planifier les objectifs futurs',
        'Partager votre expérience'
      ]
    }
  })

  return {
    currentPhase,
    motivationalMessage,
    currentObjectives,
    nextSteps,
    daysRemaining,
    onboardingProgress
  }
}