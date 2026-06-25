import { createContext, useContext, useReducer, useCallback } from 'react'

// ──────────────────────────────────────────────────────────────────────────────
// State shape
// ──────────────────────────────────────────────────────────────────────────────
const initialState = {
  // Saved / wishlist car IDs
  savedCars: [],

  // Comparison list (max 3 car IDs)
  comparisonList: [],

  // Last recommendation quiz answers
  quizAnswers: {},

  // Active discovery filters
  filters: {
    category: 'all',
    fuelType: '',
    transmission: '',
    priceRange: [5, 60],
    minSeating: 0,
    search: '',
    sortBy: 'relevance',
  },

  // Global toast/notification
  toast: null,
}

// ──────────────────────────────────────────────────────────────────────────────
// Actions
// ──────────────────────────────────────────────────────────────────────────────
const ACTIONS = {
  TOGGLE_SAVED: 'TOGGLE_SAVED',
  ADD_TO_COMPARISON: 'ADD_TO_COMPARISON',
  REMOVE_FROM_COMPARISON: 'REMOVE_FROM_COMPARISON',
  CLEAR_COMPARISON: 'CLEAR_COMPARISON',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_QUIZ_ANSWERS: 'SET_QUIZ_ANSWERS',
  RESET_QUIZ: 'RESET_QUIZ',
  SHOW_TOAST: 'SHOW_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
}

// ──────────────────────────────────────────────────────────────────────────────
// Reducer
// ──────────────────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {

    case ACTIONS.TOGGLE_SAVED: {
      const id = action.payload
      const isSaved = state.savedCars.includes(id)
      return {
        ...state,
        savedCars: isSaved
          ? state.savedCars.filter((c) => c !== id)
          : [...state.savedCars, id],
      }
    }

    case ACTIONS.ADD_TO_COMPARISON: {
      const id = action.payload
      if (state.comparisonList.includes(id)) return state
      if (state.comparisonList.length >= 3) {
        // Replace the last one
        return {
          ...state,
          comparisonList: [...state.comparisonList.slice(0, 2), id],
        }
      }
      return { ...state, comparisonList: [...state.comparisonList, id] }
    }

    case ACTIONS.REMOVE_FROM_COMPARISON: {
      return {
        ...state,
        comparisonList: state.comparisonList.filter((id) => id !== action.payload),
      }
    }

    case ACTIONS.CLEAR_COMPARISON:
      return { ...state, comparisonList: [] }

    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case ACTIONS.RESET_FILTERS:
      return { ...state, filters: initialState.filters }

    case ACTIONS.SET_QUIZ_ANSWERS:
      return {
        ...state,
        quizAnswers: { ...state.quizAnswers, ...action.payload },
      }

    case ACTIONS.RESET_QUIZ:
      return { ...state, quizAnswers: {} }

    case ACTIONS.SHOW_TOAST:
      return { ...state, toast: action.payload }

    case ACTIONS.DISMISS_TOAST:
      return { ...state, toast: null }

    default:
      return state
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // ── Saved Cars ───────────────────────────────────────────────
  const toggleSaved = useCallback((carId) => {
    const isSaved = state.savedCars.includes(carId)
    dispatch({ type: ACTIONS.TOGGLE_SAVED, payload: carId })
    dispatch({
      type: ACTIONS.SHOW_TOAST,
      payload: {
        message: isSaved ? 'Removed from saved cars' : 'Added to your garage',
        type: isSaved ? 'info' : 'success',
        icon: isSaved ? '🗑️' : '❤️',
      },
    })
    setTimeout(() => dispatch({ type: ACTIONS.DISMISS_TOAST }), 2800)
  }, [state.savedCars])

  const isSaved = useCallback(
    (carId) => state.savedCars.includes(carId),
    [state.savedCars]
  )

  // ── Comparison ───────────────────────────────────────────────
  const addToComparison = useCallback((carId) => {
    if (state.comparisonList.includes(carId)) {
      dispatch({ type: ACTIONS.REMOVE_FROM_COMPARISON, payload: carId })
      return
    }
    dispatch({ type: ACTIONS.ADD_TO_COMPARISON, payload: carId })
    dispatch({
      type: ACTIONS.SHOW_TOAST,
      payload: {
        message:
          state.comparisonList.length >= 2
            ? 'Comparison list full (max 3) — replaced last car'
            : 'Added to comparison',
        type: 'info',
        icon: '⚖️',
      },
    })
    setTimeout(() => dispatch({ type: ACTIONS.DISMISS_TOAST }), 2800)
  }, [state.comparisonList])

  const removeFromComparison = useCallback((carId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_COMPARISON, payload: carId })
  }, [])

  const clearComparison = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_COMPARISON })
  }, [])

  const isInComparison = useCallback(
    (carId) => state.comparisonList.includes(carId),
    [state.comparisonList]
  )

  // ── Filters ──────────────────────────────────────────────────
  const setFilters = useCallback((updates) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: updates })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_FILTERS })
  }, [])

  // ── Quiz ─────────────────────────────────────────────────────
  const setQuizAnswer = useCallback((questionId, answerId) => {
    dispatch({ type: ACTIONS.SET_QUIZ_ANSWERS, payload: { [questionId]: answerId } })
  }, [])

  const resetQuiz = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_QUIZ })
  }, [])

  // ── Toast ────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'info', icon = '') => {
    dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message, type, icon } })
    setTimeout(() => dispatch({ type: ACTIONS.DISMISS_TOAST }), 2800)
  }, [])

  // ── Context Value ────────────────────────────────────────────
  const value = {
    // State
    savedCars: state.savedCars,
    comparisonList: state.comparisonList,
    filters: state.filters,
    quizAnswers: state.quizAnswers,
    toast: state.toast,

    // Computed
    savedCount: state.savedCars.length,
    comparisonCount: state.comparisonList.length,
    activeFilterCount: Object.entries(state.filters).filter(([k, v]) => {
      if (k === 'category') return v !== 'all'
      if (k === 'priceRange') return v[0] !== 5 || v[1] !== 60
      if (k === 'minSeating') return v > 0
      if (k === 'sortBy') return false
      return !!v
    }).length,

    // Actions
    toggleSaved,
    isSaved,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    setFilters,
    resetFilters,
    setQuizAnswer,
    resetQuiz,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export default AppContext