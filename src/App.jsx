/**
 * Main App component with routing
 */
import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import './i18n' // Initialize i18next

import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Direct imports for better debugging
import HomePage from './pages/HomePage'
import DonationsPage from './pages/DonationsPage'
import CreateDonationPage from './pages/CreateDonationPage'
import DonationDetailPage from './pages/DonationDetailPage'
import StatsPage from './pages/StatsPage'
import DonatePage from './pages/DonatePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/donations/:id" element={<DonationDetailPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App