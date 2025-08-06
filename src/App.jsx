/**
 * Main App component with routing
 */
import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'

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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App