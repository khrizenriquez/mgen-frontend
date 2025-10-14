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
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/layout/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AuthService from '../core/services/AuthService'

// Validation schema
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'auth.validation.name.minLength')
    .max(50, 'auth.validation.name.maxLength')
    .required('auth.validation.name.required'),
  email: yup
    .string()
    .email('auth.validation.email.invalid')
    .required('auth.validation.email.required'),
  password: yup
    .string()
    .min(8, 'auth.validation.password.minLength')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'auth.validation.password.strength')
    .required('auth.validation.password.required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'auth.validation.confirmPassword.match')
    .required('auth.validation.confirmPassword.required'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'auth.validation.terms.required')
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const { t } = useTranslation()

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
      setRegisterError(error.message || t('auth.register.error.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  if (registerSuccess) {
    return (
      <AuthLayout
        title={t('auth.register.success.title')}
        subtitle={t('auth.register.success.subtitle')}
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
              {t('auth.register.success.loginButton')}
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
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
          <Form.Label htmlFor="name">{t('auth.register.name.label')}</Form.Label>
          <Form.Control
            id="name"
            type="text"
            placeholder={t('auth.register.name.placeholder')}
            {...register('name')}
            isInvalid={!!errors.name}
            disabled={isLoading}
          />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {t(errors.name.message)}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Email field */}
        <div className="mb-3">
          <Form.Label htmlFor="email">{t('auth.register.email.label')}</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder={t('auth.register.email.placeholder')}
            {...register('email')}
            isInvalid={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {t(errors.email.message)}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Password field */}
        <div className="mb-3">
          <Form.Label htmlFor="password">{t('auth.register.password.label')}</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder={t('auth.register.password.placeholder')}
            {...register('password')}
            isInvalid={!!errors.password}
            disabled={isLoading}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {t(errors.password.message)}
            </Form.Control.Feedback>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="mb-3">
          <Form.Label htmlFor="confirmPassword">{t('auth.register.confirmPassword.label')}</Form.Label>
          <Form.Control
            id="confirmPassword"
            type="password"
            placeholder={t('auth.register.confirmPassword.placeholder')}
            {...register('confirmPassword')}
            isInvalid={!!errors.confirmPassword}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <Form.Control.Feedback type="invalid">
              {t(errors.confirmPassword.message)}
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
                {t('auth.register.terms.accept')} {' '}
                <a href="/terms" target="_blank" className="auth-link">
                  {t('auth.register.terms.terms')}
                </a>{' '}
                {t('auth.register.terms.and')} {' '}
                <a href="/privacy" target="_blank" className="auth-link">
                  {t('auth.register.terms.privacy')}
                </a>
              </span>
            }
          />
          {errors.acceptTerms && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {t(errors.acceptTerms.message)}
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
              {t('auth.register.loading')}
            </>
          ) : (
            t('auth.register.submit')
          )}
        </Button>

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('auth.register.hasAccount')}</span>
        </div>

        {/* Login link */}
        <div className="text-center">
          <Link to="/login">
            <Button className="auth-btn auth-btn-secondary w-100">
              {t('auth.register.login')}
            </Button>
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}