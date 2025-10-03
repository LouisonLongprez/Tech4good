import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const tech4goodTheme = {
  dark: false,
  colors: {
    primary: '#1d4ed8', // Bleu foncé pour excellent contraste (WCAG AA+)
    secondary: '#6d28d9', // Violet foncé pour excellent contraste
    accent: '#0e7490', // Cyan foncé pour excellent contraste
    error: '#b91c1c', // Rouge foncé pour excellent contraste
    warning: '#b45309', // Orange foncé pour excellent contraste
    info: '#1e40af', // Bleu info foncé
    success: '#047857', // Vert foncé pour excellent contraste
    background: '#f8fafc', // Gris très clair
    surface: '#ffffff',
    'surface-variant': '#f1f5f9',
    'surface-bright': '#ffffff',
    'surface-light': '#fafafa',
    'surface-dark': '#0f172a',
    'on-surface': '#0f172a', // Texte très foncé pour contraste maximum
    'on-surface-variant': '#334155', // Texte secondaire avec bon contraste
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-accent': '#ffffff',
    'on-error': '#ffffff',
    'on-warning': '#ffffff',
    'on-success': '#ffffff',
    'outline': '#475569', // Bordures avec bon contraste
    'outline-variant': '#94a3b8',
    // Couleurs spécifiques pour Tech4Good
    'tech4good-primary': '#1d4ed8',
    'tech4good-secondary': '#6d28d9',
    'tech4good-success': '#047857',
    'tech4good-accent': '#0e7490'
  }
}

const tech4goodDarkTheme = {
  dark: true,
  colors: {
    primary: '#60a5fa', // Bleu plus clair pour bon contraste sur fond sombre
    secondary: '#a78bfa', // Violet plus clair
    accent: '#22d3ee', // Cyan vif pour bon contraste
    error: '#f87171', // Rouge plus clair
    warning: '#fbbf24', // Orange plus clair
    info: '#60a5fa', // Bleu info
    success: '#34d399', // Vert plus clair
    background: '#0f172a', // Bleu très foncé
    surface: '#1e293b', // Gris-bleu foncé
    'surface-variant': '#334155',
    'surface-bright': '#475569',
    'surface-light': '#64748b',
    'surface-dark': '#0f172a',
    'on-surface': '#f8fafc', // Texte très clair pour contraste maximum
    'on-surface-variant': '#e2e8f0', // Texte secondaire clair
    'on-primary': '#0f172a', // Texte foncé sur couleurs claires
    'on-secondary': '#0f172a',
    'on-accent': '#0f172a',
    'on-error': '#0f172a',
    'on-warning': '#0f172a',
    'on-success': '#0f172a',
    'outline': '#64748b',
    'outline-variant': '#475569',
    // Couleurs spécifiques pour Tech4Good en mode sombre
    'tech4good-primary': '#60a5fa',
    'tech4good-secondary': '#a78bfa',
    'tech4good-success': '#34d399',
    'tech4good-accent': '#22d3ee'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: tech4goodTheme,
      dark: tech4goodDarkTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  defaults: {
    VCard: {
      elevation: 2,
      rounded: 'lg'
    },
    VBtn: {
      rounded: 'lg',
      size: 'default'
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg'
    }
  }
})