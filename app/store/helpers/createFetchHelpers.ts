import { fetchCompletePokemonDetail } from "app/services/api"
import type { CombinedPokemonDetail } from "app/services/types"
import { showToast } from "app/utils/toast"
import { StateCreator } from "zustand"

export interface PokemonDataState {
    // State
    pokemonDetails: Record<number, CombinedPokemonDetail> // Detailed Pokemon data keyed by ID
    currentPokemonId: number | null // Currently selected Pokemon ID
    loading: boolean
    error: string | null
    pendingFetches: Map<number, Promise<CombinedPokemonDetail>> // Track pending fetches to prevent duplicates
  
    // Actions
    fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
    getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
    setCurrentPokemonId: (id: number | null) => void
    getCurrentPokemon: () => CombinedPokemonDetail | undefined
    clearError: () => void
  }

// Type for the store creator's set and get functions
type StoreSet = Parameters<StateCreator<PokemonDataState>>[0]
type StoreGet = Parameters<StateCreator<PokemonDataState>>[1]

export const createFetchHelpers = (
    set: StoreSet,
    get: StoreGet
  ) => {
    /**
     * Check if Pokemon is cached and return it if available
     */
    const getCachedPokemon = (id: number): CombinedPokemonDetail | null => {
      const state = get()
      const cached = state.pokemonDetails[id]
      if (cached) {
        // Set as current Pokemon if not already set
        if (state.currentPokemonId !== id) {
          set({ currentPokemonId: id })
        }
        return cached
      }
      return null
    }
  
    /**
     * Check if Pokemon is already being fetched and return the existing Promise
     */
    const getExistingFetch = (id: number): Promise<CombinedPokemonDetail> | null => {
      const state = get()
      const existingFetch = state.pendingFetches.get(id)
      if (existingFetch) {
        // Set as current Pokemon if not already set
        if (state.currentPokemonId !== id) {
          set({ currentPokemonId: id })
        }
        return existingFetch
      }
      return null
    }
  
    /**
     * Set loading state
     */
    const setLoadingState = (loading: boolean) => {
      set({ loading, error: null })
    }
  
    /**
     * Store fetched Pokemon in cache and set as current
     */
    const cachePokemon = (id: number, detail: CombinedPokemonDetail) => {
      set((state) => ({
        pokemonDetails: {
          ...state.pokemonDetails,
          [id]: detail
        },
        currentPokemonId: id,
        loading: false,
      }))
    }
  
    /**
     * Get evolution IDs that need to be pre-fetched
     */
    const getEvolutionsToFetch = (
      detail: CombinedPokemonDetail,
      currentId: number
    ): number[] => {
      const evolutionIds = detail.evolutionChain
        .map((evo) => evo.id)
        .filter((evoId) => evoId !== currentId) // Exclude the current Pokemon
  
      const state = get()
      return evolutionIds.filter(
        (evoId) =>
          !state.pokemonDetails[evoId] &&
          !state.pendingFetches.has(evoId)
      )
    }
  
    /**
     * Pre-fetch evolution Pokemon in the background (non-blocking)
     */
    const prefetchEvolutions = (evolutionIds: number[]) => {
      if (evolutionIds.length === 0) return
  
      // Fetch all evolutions in parallel (non-blocking, fire and forget)
      Promise.allSettled(
        evolutionIds.map(async (evoId) => {
          try {
            const evoDetail = await fetchCompletePokemonDetail(evoId)
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
  
    /**
     * Handle fetch errors
     */
    const handleFetchError = (id: number, error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to fetch Pokemon ${id}`
      
      showToast('Pokemon Not Found', `Could not load Pokemon #${id}. It may not exist or there was a network error.`)
      
      set({
        error: errorMessage,
        loading: false,
      })
    }
  
    /**
     * Clean up pending fetch from tracking map
     */
    const cleanupPendingFetch = (id: number) => {
      set((state) => {
        const newPendingFetches = new Map(state.pendingFetches)
        newPendingFetches.delete(id)
        return { pendingFetches: newPendingFetches }
      })
    }
  
    /**
     * Add fetch Promise to pending fetches tracking
     */
    const trackPendingFetch = (id: number, promise: Promise<CombinedPokemonDetail>) => {
      set((state) => {
        const newPendingFetches = new Map(state.pendingFetches)
        newPendingFetches.set(id, promise)
        return { pendingFetches: newPendingFetches }
      })
    }
  
    return {
      getCachedPokemon,
      getExistingFetch,
      setLoadingState,
      cachePokemon,
      getEvolutionsToFetch,
      prefetchEvolutions,
      handleFetchError,
      cleanupPendingFetch,
      trackPendingFetch,
    }
  }