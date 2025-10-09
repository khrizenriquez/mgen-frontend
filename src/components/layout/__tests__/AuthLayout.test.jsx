import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import AuthLayout from '../AuthLayout'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('AuthLayout', () => {
  const mockChildren = <div>Test Content</div>

  test('renders logo and brand correctly', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    // Check logo icon by class
    const logoIcon = document.querySelector('.bi-heart-fill')
    expect(logoIcon).toBeInTheDocument()
    expect(logoIcon).toHaveClass('bi-heart-fill', 'text-danger')

    // Check brand text
    const brandText = screen.getByText('Plataforma de donaciones')
    expect(brandText).toBeInTheDocument()
    expect(brandText).toHaveClass('fw-bold', 'text-dark')
  })

  test('renders title and subtitle when provided', () => {
    const title = 'Test Title'
    const subtitle = 'Test Subtitle'

    renderWithProviders(
      <AuthLayout title={title} subtitle={subtitle}>
        {mockChildren}
      </AuthLayout>
    )

    // Check title
    const titleElement = screen.getByRole('heading', { level: 1 })
    expect(titleElement).toHaveTextContent(title)
    expect(titleElement).toHaveClass('auth-title', 'h3', 'fw-bold', 'text-dark')

    // Check subtitle
    const subtitleElement = screen.getByText(subtitle)
    expect(subtitleElement).toHaveClass('auth-subtitle', 'text-muted', 'small')
  })

  test('does not render title and subtitle when not provided', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    // Title and subtitle should not be present
    const titleElement = screen.queryByRole('heading', { level: 1 })
    expect(titleElement).toBeNull()

    const subtitleElement = screen.queryByText(/subtitle/i)
    expect(subtitleElement).toBeNull()
  })

  test('renders children content', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    const childrenContent = screen.getByText('Test Content')
    expect(childrenContent).toBeInTheDocument()
  })

  test('has correct layout structure', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    // Check main container
    const authContainer = document.querySelector('.auth-container')
    expect(authContainer).toHaveClass('auth-container', 'min-vh-100', 'd-flex', 'align-items-center', 'bg-light')

    // Check auth card
    const authCard = document.querySelector('.auth-card')
    expect(authCard).toHaveClass('auth-card', 'bg-white', 'rounded', 'shadow-sm', 'p-4')

    // Check auth content wrapper
    const authContent = document.querySelector('.auth-content')
    expect(authContent).toHaveClass('auth-content')
  })

  test('has correct responsive classes', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    // Check responsive column classes - find the Col element by its Bootstrap classes
    const colElement = document.querySelector('.col-xl-4.col-lg-4.col-md-6.col-sm-8.col-12')
    expect(colElement).toBeInTheDocument()
    expect(colElement).toHaveClass('col-12', 'col-sm-8', 'col-md-6', 'col-lg-4', 'col-xl-4')
  })

  test('logo link navigates to home page', () => {
    renderWithProviders(<AuthLayout>{mockChildren}</AuthLayout>)

    const logoLink = screen.getByRole('link', { name: /plataforma de donaciones/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })
})