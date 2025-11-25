import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  fetchCompletePokemonDetail,
  fetchPokemonById,
} from '../services/api'
import type { CombinedPokemonDetail, PokemonDetail } from '../services/types'
import { showToast } from '../utils/toast'

interface PokemonDataState {
  // State
  pokemonDetails: Record<number, CombinedPokemonDetail> // Detailed Pokemon data keyed by ID
  basicPokemonCache: Record<number, PokemonDetail> // Cache for basic Pokemon data (used in evolutions)
  currentPokemonId: number | null // Currently selected Pokemon ID
  loading: boolean
  error: string | null
  pendingFetches: Map<number, Promise<CombinedPokemonDetail>> // Track pending fetches to prevent duplicates

  // Actions
  fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
  fetchBasicPokemon: (id: number) => Promise<PokemonDetail>
  getBasicPokemon: (id: number) => PokemonDetail | undefined
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  setCurrentPokemonId: (id: number | null) => void
  getCurrentPokemon: () => CombinedPokemonDetail | undefined
  clearError: () => void
}

export const usePokemonDataStore = create<PokemonDataState>()(
  persist(
    (set, get) => ({
      // Initial state
      pokemonDetails: {},
      basicPokemonCache: {},
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
        const state = get()

        // Clear any previous errors at the start
        set({ error: null })

        // Check if already cached
        if (state.pokemonDetails[id]) {
          // Also set as current Pokemon if not already set
          if (state.currentPokemonId !== id) {
            set({ currentPokemonId: id })
          }
          return state.pokemonDetails[id]
        }

        // Check if already fetching this ID - return existing Promise
        const existingFetch = state.pendingFetches.get(id)
        if (existingFetch) {
          // Also set as current Pokemon if not already set
          if (state.currentPokemonId !== id) {
            set({ currentPokemonId: id })
          }
          return existingFetch
        }

        // Create new fetch Promise
        const fetchPromise = (async () => {
          try {
            // Mark as loading
            set(() => ({
              loading: true,
              error: null
            }))

            // Pass existing basic cache and callback to store evolution Pokemon
            const currentState = get()
            const cacheEvolutionPokemon = (pokemonId: number, data: PokemonDetail) => {
              set(state => ({
                basicPokemonCache: {
                  ...state.basicPokemonCache,
                  [pokemonId]: data
                }
              }))
            }
            
            const detail = await fetchCompletePokemonDetail(
              id, 
              currentState.basicPokemonCache,
              cacheEvolutionPokemon
            )
            
            // Store in cache and set as current Pokemon
            set(state => ({
              pokemonDetails: {
                ...state.pokemonDetails,
                [id]: detail
              },
              currentPokemonId: id,
              loading: false,
            }))

            // Pre-fetch full details for all evolution Pokemon in the background
            // This ensures they're instantly available when clicked
            const evolutionIds = detail.evolutionChain
              .map((evo) => evo.id)
              .filter((evoId) => evoId !== id) // Exclude the current Pokemon

            // Filter out evolutions that are already cached or being fetched
            const currentStateAfterMain = get()
            const evolutionsToFetch = evolutionIds.filter(
              (evoId) =>
                !currentStateAfterMain.pokemonDetails[evoId] &&
                !currentStateAfterMain.pendingFetches.has(evoId)
            )

            // Pre-fetch evolution details in background (non-blocking)
            if (evolutionsToFetch.length > 0) {
              // Cache basicPokemonCache once before the map to avoid multiple get() calls
              const currentBasicCache = get().basicPokemonCache
              
              // Fetch all evolutions in parallel (non-blocking, fire and forget)
              Promise.allSettled(
                evolutionsToFetch.map(async (evoId) => {
                  try {
                    // Fetch full details for this evolution
                    const evoDetail = await fetchCompletePokemonDetail(
                      evoId,
                      currentBasicCache,
                      cacheEvolutionPokemon
                    )

                    // Store in cache
                    set((state) => ({
                      pokemonDetails: {
                        ...state.pokemonDetails,
                        [evoId]: evoDetail,
                      },
                    }))
                  } catch (_error) {
                    // Silently fail for background fetches - don't show errors
                  }
                })
              ).catch(() => {
                // Ignore errors in background pre-fetching
              })
            }

            return detail
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to fetch Pokemon ${id}`
            
            // Show toast notification
            showToast('Pokemon Not Found', `Could not load Pokemon #${id}. It may not exist or there was a network error.`)
            
            // Set error state
            set(() => ({
              error: errorMessage,
              loading: false,
            }))
            
            throw error
          } finally {
            // Clean up: remove from pending fetches
            set(state => {
              const newPendingFetches = new Map(state.pendingFetches)
              newPendingFetches.delete(id)
              return { pendingFetches: newPendingFetches }
            })
          }
        })()

        // Store the Promise in pendingFetches
        set(state => {
          const newPendingFetches = new Map(state.pendingFetches)
          newPendingFetches.set(id, fetchPromise)
          return { pendingFetches: newPendingFetches }
        })

        return fetchPromise
      },

      /**
       * Fetch basic Pokemon data (for evolution chains, etc.)
       * Caches in basicPokemonCache
       */
      fetchBasicPokemon: async (id: number): Promise<PokemonDetail> => {
        const state = get()

        // Check cache first
        if (state.basicPokemonCache[id]) {
          return state.basicPokemonCache[id]
        }

        const basicData = await fetchPokemonById(id)
        
        // Store in basic cache
        set(state => ({
          basicPokemonCache: {
            ...state.basicPokemonCache,
            [id]: basicData
          }
        }))

        return basicData
      },

      /**
       * Get basic Pokemon from cache (does not fetch)
       */
      getBasicPokemon: (id: number) => {
        return get().basicPokemonCache[id]
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
    }),
    {
      name: 'pokemon-data-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist details and cache, not loading/error states
      partialize: (state) => ({
        pokemonDetails: state.pokemonDetails,
        basicPokemonCache: state.basicPokemonCache,
        currentPokemonId: state.currentPokemonId,
      })
    }
  )
)

