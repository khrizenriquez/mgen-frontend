/**
 * Login Page Component
 * Minimalist login form inspired by yomeuno.com
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/layout/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AuthService from '../core/services/AuthService'

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('auth.validation.email.invalid')
    .required('auth.validation.email.required'),
  password: yup
    .string()
    .min(6, 'auth.validation.password.minLength')
    .required('auth.validation.password.required'),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setLoginError('')

    try {
      const result = await AuthService.login(data)

      if (result.success) {
        // Redirect to home page after successful login
        navigate('/', { replace: true })
      }
    } catch (error) {
      setLoginError(error.message || t('auth.login.error.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      <Form 
        className={`auth-form ${isLoading ? 'loading' : ''}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {loginError && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            {loginError}
          </Alert>
        )}

        {/* Email field */}
        <div className="mb-3">
          <Form.Label htmlFor="email">Correo electrónico</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder="tu email"
            {...register('email')}
            isInvalid={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Password field */}
        <div className="mb-4">
          <Form.Label htmlFor="password">Contraseña</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder="tu contraseña"
            {...register('password')}
            isInvalid={!!errors.password}
            disabled={isLoading}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="auth-btn auth-btn-primary w-100 mb-3"
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" text="" className="me-2" />
              Iniciando sesión...
            </>
          ) : (
            'Siguiente'
          )}
        </Button>

        {/* Forgot password link */}
        <div className="text-center mb-3">
          <Link to="/forgot-password" className="auth-link">
            ← Olvidé mi contraseña
          </Link>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span>¿No tienes cuenta?</span>
        </div>

        {/* Register link */}
        <div className="text-center">
          <Link to="/register">
            <Button className="auth-btn auth-btn-secondary w-100">
              Crear cuenta nueva
            </Button>
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}