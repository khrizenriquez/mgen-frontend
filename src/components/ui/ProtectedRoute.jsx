/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */
import { Navigate, useLocation } from 'react-router-dom'
import AuthService from '../../core/services/AuthService'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requireAuth = true
}) {
  const location = useLocation()
  const isAuthenticated = AuthService.isAuthenticated()
  const currentUser = AuthService.getCurrentUser()

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user is authenticated but we need to check roles
  if (isAuthenticated && requiredRoles.length > 0) {
    const userRoles = currentUser?.roles || []
    const hasRequiredRole = requiredRoles.some(role =>
      userRoles.includes(role.toUpperCase())
    )

    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to their dashboard
      const dashboardRoute = AuthService.getDashboardRoute()
      return <Navigate to={dashboardRoute} replace />
    }
  }

  // If authentication is not required, allow access
  if (!requireAuth) {
    return children
  }

  // All checks passed, render children
  return children
}

/**
 * Higher-order component for protecting entire pages
 */
export function withAuthProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}