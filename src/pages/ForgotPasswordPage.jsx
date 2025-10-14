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
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/layout/AuthLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AuthService from '../core/services/AuthService'

// Validation schema
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('auth.validation.email.invalid')
    .required('auth.validation.email.required'),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const { t } = useTranslation()

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
      setResetError(error.message || t('auth.forgotPassword.error.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <AuthLayout
        title={t('auth.forgotPassword.success.title')}
        subtitle={t('auth.forgotPassword.success.subtitle')}
      >
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-envelope-check-fill text-success" style={{fontSize: '4rem'}}></i>
          </div>
          <p className="text-muted mb-3">
            {t('auth.forgotPassword.success.description')}
          </p>
          <p className="fw-bold mb-4 text-dark">
            {getValues('email')}
          </p>
          <p className="text-muted small mb-4">
            {t('auth.forgotPassword.success.instructions')}
          </p>

          <div className="d-grid gap-2">
            <Link to="/login">
              <Button className="auth-btn auth-btn-primary w-100">
                {t('auth.forgotPassword.success.backToLogin')}
              </Button>
            </Link>
            <Button
              className="auth-btn auth-btn-secondary w-100"
              onClick={() => {
                setResetSuccess(false)
                setResetError('')
              }}
            >
              {t('auth.forgotPassword.success.resend')}
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
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
            {t('auth.forgotPassword.description')}
          </p>
        </div>

        {/* Email field */}
        <div className="mb-4">
          <Form.Label htmlFor="email">{t('auth.forgotPassword.email.label')}</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder={t('auth.forgotPassword.email.placeholder')}
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

        {/* Submit button */}
        <Button
          type="submit"
          className="auth-btn auth-btn-primary w-100 mb-3"
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" text="" className="me-2" />
              {t('auth.forgotPassword.loading')}
            </>
          ) : (
            <>
              <i className="bi bi-envelope-fill me-2"></i>
              {t('auth.forgotPassword.submit')}
            </>
          )}
        </Button>

        {/* Back to login link */}
        <div className="text-center mb-3">
          <Link to="/login" className="auth-link">
            {t('auth.forgotPassword.backToLogin')}
          </Link>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('auth.forgotPassword.noAccount')}</span>
        </div>

        {/* Register link */}
        <div className="text-center">
          <Link to="/register">
            <Button className="auth-btn auth-btn-secondary w-100">
              {t('auth.forgotPassword.createAccount')}
            </Button>
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}