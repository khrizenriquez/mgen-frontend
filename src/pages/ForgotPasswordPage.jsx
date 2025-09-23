/**
 * Forgot Password Page Component
 * Minimalist forgot password form inspired by yomeuno.com
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../components/layout/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AuthService from '../core/services/AuthService'

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es requerido'),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setResetError('')
    setResetSuccess(false)
    
    try {
      const result = await AuthService.resetPassword(data.email)
      
      if (result.success) {
        setResetSuccess(true)
      }
    } catch (error) {
      setResetError(error.message || 'Error al enviar el correo de recuperación. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <AuthLayout 
        title="Revisa tu correo"
        subtitle="Te hemos enviado las instrucciones"
      >
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-envelope-check-fill text-success" style={{fontSize: '4rem'}}></i>
          </div>
          <p className="text-muted mb-3">
            Hemos enviado un enlace de recuperación a:
          </p>
          <p className="fw-bold mb-4 text-dark">
            {getValues('email')}
          </p>
          <p className="text-muted small mb-4">
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            Si no encuentras el correo, revisa tu carpeta de spam.
          </p>
          
          <div className="d-grid gap-2">
            <Link to="/login">
              <Button className="auth-btn auth-btn-primary w-100">
                Volver a iniciar sesión
              </Button>
            </Link>
            <Button 
              className="auth-btn auth-btn-secondary w-100"
              onClick={() => {
                setResetSuccess(false)
                setResetError('')
              }}
            >
              Enviar correo nuevamente
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="¿Olvidaste tu contraseña?"
      subtitle="Ingresa tu correo para recuperar el acceso"
    >
      <Form 
        className={`auth-form ${isLoading ? 'loading' : ''}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {resetError && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            {resetError}
          </Alert>
        )}

        {/* Instructions */}
        <div className="mb-4 text-center">
          <div className="mb-3">
            <i className="bi bi-key-fill text-muted" style={{fontSize: '2.5rem'}}></i>
          </div>
          <p className="text-muted small">
            No te preocupes, te ayudamos a recuperar tu cuenta. 
            Ingresa tu correo electrónico y te enviaremos las instrucciones.
          </p>
        </div>

        {/* Email field */}
        <div className="mb-4">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
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

        {/* Submit button */}
        <Button 
          type="submit" 
          className="auth-btn auth-btn-primary w-100 mb-3"
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" text="" className="me-2" />
              Enviando correo...
            </>
          ) : (
            <>
              <i className="bi bi-envelope-fill me-2"></i>
              Enviar instrucciones
            </>
          )}
        </Button>

        {/* Back to login link */}
        <div className="text-center mb-3">
          <Link to="/login" className="auth-link">
            ← Volver al inicio de sesión
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