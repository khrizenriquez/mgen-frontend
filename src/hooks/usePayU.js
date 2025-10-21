/**
 * PayU Payment Hooks
 * React Query hooks for PayU payment operations
 */
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import PayUService from '../core/services/PayUService.js'

/**
 * Hook for PayU payment operations
 */
export const usePayU = () => {
  const queryClient = useQueryClient()

  // Create PayU payment
  const createPayment = useMutation({
    mutationFn: ({ donationId, options }) =>
      PayUService.createPayment(donationId, options),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries(['donations'])
      queryClient.invalidateQueries(['donation', data.donation_id])

      toast.success('Pago creado exitosamente')

      // Redirect to PayU payment URL
      if (data.payment_url) {
        window.location.href = data.payment_url
      }
    },
    onError: (error) => {
      console.error('Error creating PayU payment:', error)
      toast.error('Error al crear el pago. Intente nuevamente.')
    }
  })

  // Check payment status
  const checkPaymentStatus = useMutation({
    mutationFn: ({ donationId, payuOrderId }) =>
      PayUService.getPaymentStatus(donationId, payuOrderId),
    onSuccess: (data) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries(['donations'])
      if (data.donation_id) {
        queryClient.invalidateQueries(['donation', data.donation_id])
      }
    }
  })

  return {
    createPayment,
    checkPaymentStatus,
    isLoading: createPayment.isLoading || checkPaymentStatus.isLoading,
    error: createPayment.error || checkPaymentStatus.error
  }
}

/**
 * Hook for PayU configuration status
 */
export const usePayUConfig = () => {
  return useQuery({
    queryKey: ['payu-config'],
    queryFn: () => PayUService.getConfigStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('Error fetching PayU config:', error)
    }
  })
}

/**
 * Hook for payment status polling
 */
export const usePaymentStatus = (donationId, options = {}) => {
  const {
    enabled = true,
    refetchInterval = false,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: ['payment-status', donationId],
    queryFn: () => PayUService.getPaymentStatus(donationId),
    enabled: enabled && !!donationId,
    refetchInterval: refetchInterval,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...queryOptions,
    onError: (error) => {
      console.error('Error fetching payment status:', error)
    }
  })
}

export default usePayU
