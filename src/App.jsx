/**
 * Main App component with routing
 */
import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import './i18n' // Initialize i18next

import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ProtectedRoute from './components/ui/ProtectedRoute'

// Direct imports for better debugging
import HomePage from './pages/HomePage'
import DonationsPage from './pages/DonationsPage'
import CreateDonationPage from './pages/CreateDonationPage'
import DonationDetailPage from './pages/DonationDetailPage'
import DonationPaymentPage from './pages/DonationPaymentPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import StatsPage from './pages/StatsPage'
import DonatePage from './pages/DonatePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminDonationsPage from './pages/AdminDonationsPage'
import AdminReportsPage from './pages/AdminReportsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import UserDashboardPage from './pages/UserDashboardPage'
import DonorDashboardPage from './pages/DonorDashboardPage'
import DonorProfilePage from './pages/DonorProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes with main layout */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/donations" element={
            <Layout>
              <DonationsPage />
            </Layout>
          } />
          <Route path="/donations/:id" element={
            <Layout>
              <DonationDetailPage />
            </Layout>
          } />
          <Route path="/donations/:donationId/payment" element={
            <ProtectedRoute>
              <Layout>
                <DonationPaymentPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/payment/success" element={
            <Layout>
              <PaymentSuccessPage />
            </Layout>
          } />
          <Route path="/donate" element={
            <Layout>
              <DonatePage />
            </Layout>
          } />
          <Route path="/stats" element={
            <Layout>
              <StatsPage />
            </Layout>
          } />

          {/* Authentication routes with auth layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Unified dashboard route - content changes based on user role */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />

          {/* Admin specific routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
          <Route path="/admin/donations" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={
            <Layout>
              <NotFoundPage />
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App