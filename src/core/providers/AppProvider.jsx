/**
 * App Provider - Global application context and state
 */
import { createContext, useContext, useReducer, useEffect } from 'react'
import { DonationService } from '../services/DonationService'

// Initial state
const initialState = {
  donations: [],
  statistics: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    donationType: null,
    limit: 20,
    offset: 0,
  },
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DONATIONS: 'SET_DONATIONS',
  SET_STATISTICS: 'SET_STATISTICS',
  ADD_DONATION: 'ADD_DONATION',
  UPDATE_DONATION: 'UPDATE_DONATION',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ActionTypes.SET_DONATIONS:
      return { ...state, donations: action.payload, loading: false, error: null }
    
    case ActionTypes.SET_STATISTICS:
      return { ...state, statistics: action.payload }
    
    case ActionTypes.ADD_DONATION:
      return { 
        ...state, 
        donations: [action.payload, ...state.donations],
        error: null 
      }
    
    case ActionTypes.UPDATE_DONATION:
      return {
        ...state,
        donations: state.donations.map(donation =>
          donation.id === action.payload.id ? action.payload : donation
        ),
        error: null
      }
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const donationService = new DonationService()

  // Actions
  const actions = {
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error })
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR })
    },

    loadDonations: async (filters = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        const result = await donationService.getAll({ ...state.filters, ...filters })
        dispatch({ type: ActionTypes.SET_DONATIONS, payload: result.donations })
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      }
    },

    loadStatistics: async () => {
      try {
        const stats = await donationService.getStatistics()
        dispatch({ type: ActionTypes.SET_STATISTICS, payload: stats })
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    },

    createDonation: async (donationData) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        const donation = await donationService.create(donationData)
        dispatch({ type: ActionTypes.ADD_DONATION, payload: donation })
        return donation
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    processDonation: async (id) => {
      try {
        const donation = await donationService.process(id)
        dispatch({ type: ActionTypes.UPDATE_DONATION, payload: donation })
        return donation
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    cancelDonation: async (id) => {
      try {
        const donation = await donationService.cancel(id)
        dispatch({ type: ActionTypes.UPDATE_DONATION, payload: donation })
        return donation
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
        throw error
      }
    },

    setFilters: (filters) => {
      dispatch({ type: ActionTypes.SET_FILTERS, payload: filters })
    },
  }

  // Load initial data
  useEffect(() => {
    actions.loadDonations()
    actions.loadStatistics()
  }, [])

  const value = {
    ...state,
    actions,
    donationService,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}