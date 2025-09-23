/**
 * Register Page Component
 * Minimalist registration form inspired by yomeuno.com
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
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setRegisterError('')
    setRegisterSuccess(false)
    
    try {
      const result = await AuthService.register(data)
      
      if (result.success) {
        setRegisterSuccess(true)
      }
    } catch (error) {
      setRegisterError(error.message || 'Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (registerSuccess) {
    return (
      <AuthLayout 
        title="¡Cuenta creada!"
        subtitle="Tu cuenta ha sido creada exitosamente"
      >
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{fontSize: '4rem'}}></i>
          </div>
          <p className="text-muted mb-4">
            Ahora puedes iniciar sesión con tus credenciales.
          </p>
          <Link to="/login">
            <Button className="auth-btn auth-btn-primary w-100">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Crear cuenta nueva"
      subtitle="Completa la información para registrarte"
    >
      <Form 
        className={`auth-form ${isLoading ? 'loading' : ''}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {registerError && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            {registerError}
          </Alert>
        )}

        {/* Name field */}
        <div className="mb-3">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="tu nombre completo"
            {...register('name')}
            isInvalid={!!errors.name}
            disabled={isLoading}
          />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name.message}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Email field */}
        <div className="mb-3">
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

        {/* Password field */}
        <div className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
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

        {/* Confirm Password field */}
        <div className="mb-3">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="confirma tu contraseña"
            {...register('confirmPassword')}
            isInvalid={!!errors.confirmPassword}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword.message}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Terms and conditions */}
        <div className="mb-4">
          <Form.Check
            type="checkbox"
            id="acceptTerms"
            {...register('acceptTerms')}
            isInvalid={!!errors.acceptTerms}
            disabled={isLoading}
            label={
              <span className="small">
                Acepto los{' '}
                <a href="/terms" target="_blank" className="auth-link">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacy" target="_blank" className="auth-link">
                  política de privacidad
                </a>
              </span>
            }
          />
          {errors.acceptTerms && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.acceptTerms.message}
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
              Creando cuenta...
            </>
          ) : (
            'Crear cuenta'
          )}
        </Button>

        {/* Divider */}
        <div className="auth-divider">
          <span>¿Ya tienes cuenta?</span>
        </div>

        {/* Login link */}
        <div className="text-center">
          <Link to="/login">
            <Button className="auth-btn auth-btn-secondary w-100">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}