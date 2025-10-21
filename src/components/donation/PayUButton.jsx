/**
 * PayU Payment Button Component
 * Handles PayU payment creation and redirection
 */
import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { usePayU } from '../../hooks/usePayU.js'
import { useTranslation } from 'react-i18next'

export const PayUButton = ({
  donationId,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onSuccess,
  onError,
  children,
  ...props
}) => {
  const { t } = useTranslation()
  const { createPayment, isLoading } = usePayU()

  const handlePayment = async () => {
    if (!donationId) {
      console.error('PayUButton: donationId is required')
      onError?.(new Error('Donation ID is required'))
      return
    }

    try {
      await createPayment.mutateAsync({
        donationId,
        options: {
          responseUrl: `${window.location.origin}/payment/success`,
          confirmationUrl: `${window.location.origin}/api/v1/webhooks/payu/confirmation`
        }
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error initiating PayU payment:', error)
      onError?.(error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      onClick={handlePayment}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          {t('payment.processing', 'Procesando...')}
        </>
      ) : (
        children || t('payment.payWithPayU', 'Pagar con PayU')
      )}
    </Button>
  )
}

export default PayUButton
