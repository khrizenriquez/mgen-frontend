/**
 * Donations Hooks
 * React Query hooks for donation operations
 */
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import DonationService from '../core/services/DonationService.js'

/**
 * Hook for fetching a single donation
 */
export const useDonation = (donationId, options = {}) => {
  return useQuery({
    queryKey: ['donation', donationId],
    queryFn: () => DonationService.getById(donationId),
    enabled: !!donationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
    onError: (error) => {
      console.error('Error fetching donation:', error)
    }
  })
}

/**
 * Hook for fetching donations list with PayU polling
 */
export const useDonations = (filters = {}, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: ['donations', filters],
    queryFn: () => DonationService.getAll(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    // Poll more frequently if there are pending payments
    refetchInterval: (data) => {
      if (!data?.donations) return false

      const hasPendingPayments = data.donations.some(donation =>
        donation.status_id === 1 && donation.payu_order_id // PENDING with PayU order
      )

      return hasPendingPayments ? 30000 : false // Poll every 30 seconds if pending payments
    },
    ...queryOptions,
    onError: (error) => {
      console.error('Error fetching donations:', error)
      toast.error('Error al cargar donaciones')
    }
  })
}

/**
 * Hook for creating donations
 */
export const useCreateDonation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (donationData) => DonationService.create(donationData),
    onSuccess: (data) => {
      // Invalidate and refetch donations
      queryClient.invalidateQueries(['donations'])
      toast.success('Donación creada exitosamente')
      return data
    },
    onError: (error) => {
      console.error('Error creating donation:', error)
      toast.error('Error al crear la donación')
      throw error
    }
  })
}

/**
 * Hook for updating donations
 */
export const useUpdateDonation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => DonationService.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific donation in cache
      queryClient.invalidateQueries(['donation', variables.id])
      queryClient.invalidateQueries(['donations'])
      toast.success('Donación actualizada exitosamente')
      return data
    },
    onError: (error) => {
      console.error('Error updating donation:', error)
      toast.error('Error al actualizar la donación')
      throw error
    }
  })
}

/**
 * Hook for deleting donations
 */
export const useDeleteDonation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => DonationService.delete(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.invalidateQueries(['donations'])
      queryClient.removeQueries(['donation', id])
      toast.success('Donación eliminada exitosamente')
      return data
    },
    onError: (error) => {
      console.error('Error deleting donation:', error)
      toast.error('Error al eliminar la donación')
      throw error
    }
  })
}

export default useDonations
