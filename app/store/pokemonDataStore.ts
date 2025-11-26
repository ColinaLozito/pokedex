import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  fetchCompletePokemonDetail,
} from '../services/api'
import type { CombinedPokemonDetail } from '../services/types'
import { PokemonDataState, createFetchHelpers } from './helpers/createFetchHelpers'


export const usePokemonDataStore = create<PokemonDataState>()(
  persist(
    (set, get) => {
      const helpers = createFetchHelpers(set, get)

      return {
        // Initial state
        pokemonDetails: {},
        currentPokemonId: null,
        loading: false,
        error: null,
        pendingFetches: new Map(),

        /**
         * Fetch complete Pokemon details (with species and evolution chain)
         * Returns cached data if available, otherwise fetches from API
         * Uses Promise-based deduplication to prevent duplicate fetches
         */
        fetchPokemonDetail: async (id: number): Promise<CombinedPokemonDetail> => {
          // Clear any previous errors at the start
          set({ error: null })

          // Check cache first
          const cached = helpers.getCachedPokemon(id)
          if (cached) {
            return cached
          }

          // Check if already fetching - return existing Promise
          const existingFetch = helpers.getExistingFetch(id)
          if (existingFetch) {
            return existingFetch
          }

          // Create new fetch Promise
          const fetchPromise = (async () => {
            try {
              helpers.setLoadingState(true)
              
              const detail = await fetchCompletePokemonDetail(id)
              helpers.cachePokemon(id, detail)

              // Pre-fetch evolutions in background
              const evolutionsToFetch = helpers.getEvolutionsToFetch(detail, id)
              helpers.prefetchEvolutions(evolutionsToFetch)

              return detail
            } catch (error) {
              helpers.handleFetchError(id, error)
              throw error
            } finally {
              helpers.cleanupPendingFetch(id)
            }
          })()

          // Track the pending fetch
          helpers.trackPendingFetch(id, fetchPromise)

          return fetchPromise
        },

        /**
         * Get Pokemon detail from cache (does not fetch)
         */
        getPokemonDetail: (id: number) => {
          return get().pokemonDetails[id]
        },

        /**
         * Set the current Pokemon ID
         */
        setCurrentPokemonId: (id: number | null) => {
          set({ currentPokemonId: id })
        },

        /**
         * Get the current Pokemon detail
         */
        getCurrentPokemon: () => {
          const state = get()
          if (state.currentPokemonId === null) return undefined
          return state.pokemonDetails[state.currentPokemonId]
        },

        /**
         * Clear error state
         */
        clearError: () => {
          set({ error: null })
        },
      }
    },
    {
      name: 'pokemon-data-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist details, not loading/error states
      partialize: (state) => ({
        pokemonDetails: state.pokemonDetails,
        currentPokemonId: state.currentPokemonId,
      })
    }
  )
)

