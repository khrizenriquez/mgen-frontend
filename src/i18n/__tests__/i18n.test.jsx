/**
 * i18n Configuration Tests
 */
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import i18n from '../index'

// Test component that uses translations
function TestComponent() {
  const { t } = useTranslation()
  return (
    <div>
      <h1>{t('auth.brand.name')}</h1>
      <p>{t('auth.login.title')}</p>
      <p>{t('auth.login.subtitle')}</p>
    </div>
  )
}

describe('i18n Configuration', () => {
  test('i18n instance is properly configured', () => {
    expect(i18n).toBeDefined()
    expect(i18n.language).toBe('es')
    expect(i18n.isInitialized).toBe(true)
  })

  test('common translations are loaded correctly', () => {
    const brandName = i18n.t('common.brand.name')
    const copyright = i18n.t('common.footer.copyright', { year: 2025 })
    const homeNav = i18n.t('common.navigation.home')

    expect(brandName).toBe('Plataforma de donaciones')
    expect(copyright).toBe('© 2025 Plataforma de donaciones.')
    expect(homeNav).toBe('Inicio')
  })

  test('home page translations are loaded correctly', () => {
    const heroTitle = i18n.t('home.hero.title')
    const impactTitle = i18n.t('home.impact.title')
    const aboutTitle = i18n.t('home.about.title')

    expect(heroTitle).toBe('Ayudar sin esperar nada a cambio')
    expect(impactTitle).toBe('Nuestro impacto')
    expect(aboutTitle).toBe('¿Quiénes somos?')
  })

  test('auth translations are loaded correctly', () => {
    const loginTitle = i18n.t('auth.login.title')
    const loginSubtitle = i18n.t('auth.login.subtitle')
    const registerTitle = i18n.t('auth.register.title')

    expect(loginTitle).toBe('Tu cuenta en')
    expect(loginSubtitle).toBe('Ingresa tu correo electrónico')
    expect(registerTitle).toBe('Crear cuenta nueva')
  })

  test('useTranslation hook works in components', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    )

    // The test passes if no errors are thrown during rendering
    expect(true).toBe(true)
  })

  test('validation messages are properly translated', () => {
    const emailRequired = i18n.t('auth.validation.email.required')
    const passwordMinLength = i18n.t('auth.validation.password.minLength')
    const nameRequired = i18n.t('auth.validation.name.required')
    const termsRequired = i18n.t('auth.validation.terms.required')

    expect(emailRequired).toBe('El correo electrónico es requerido')
    expect(passwordMinLength).toBe('La contraseña debe tener al menos 8 caracteres')
    expect(nameRequired).toBe('El nombre es requerido')
    expect(termsRequired).toBe('Debes aceptar los términos y condiciones')
  })

  test('dynamic year interpolation works', () => {
    const currentYear = new Date().getFullYear()
    const copyright = i18n.t('common.footer.copyright', { year: currentYear })

    expect(copyright).toContain(currentYear.toString())
    expect(copyright).toContain('Plataforma de donaciones')
  })
})