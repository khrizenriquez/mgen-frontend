/**
 * i18next configuration for client-side internationalization
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import es from './locales/es.json'

// Configuration
const resources = {
  es: {
    translation: es
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // Disable suspense for better compatibility
    }
  })

export default i18n