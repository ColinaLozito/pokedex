import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  fetchCompletePokemonDetail,
  fetchPokemonById,
  fetchPokemonByType,
  fetchPokemonList,
} from '../services/api'
import type { CombinedPokemonDetail, PokemonDetail, PokemonListItem } from '../services/types'
import { getPokemonDisplayData } from '../utils/pokemonDisplayUtils'
import { showToast } from '../utils/toast'

interface PokemonDataState {
  // State
  pokemonList: PokemonListItem[] // Lightweight list of all Pokemon
  pokemonDetails: Record<number, CombinedPokemonDetail> // Detailed Pokemon data keyed by ID
  basicPokemonCache: Record<number, PokemonDetail> // Cache for basic Pokemon data (used in evolutions)
  currentPokemonId: number | null // Currently selected Pokemon ID
  bookmarkedPokemonIds: number[] // Array of bookmarked Pokemon IDs (for kid)
  parentBookmarkedPokemonIds: number[] // Array of bookmarked Pokemon IDs (for parent)
  loading: boolean
  error: string | null
  fetchingIds: Set<number> // Track which IDs are currently being fetched to prevent duplicates

  // Actions
  fetchPokemonListAction: () => Promise<void>
  fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
  fetchBasicPokemon: (id: number) => Promise<PokemonDetail>
  getBasicPokemon: (id: number) => PokemonDetail | undefined
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  setCurrentPokemonId: (id: number | null) => void
  getCurrentPokemon: () => CombinedPokemonDetail | undefined
  clearError: () => void
  toggleBookmark: (id: number) => void
  isBookmarked: (id: number) => boolean
  getBookmarkedPokemon: () => CombinedPokemonDetail[]
  toggleParentBookmark: (id: number) => void
  isParentBookmarked: (id: number) => boolean
  getParentBookmarkedPokemon: () => CombinedPokemonDetail[]
  
  // Helper methods
  getPokemonDisplayData: (
    pokemonList: PokemonListItem[],
    fallbackType?: string
  ) => Array<{
    id: number
    name: string
    sprite: string | null
    primaryType: string
    types?: Array<{ slot: number; type: { name: string; url: string } }>
  }> // Transform Pokemon list to display-ready data with sprites and types
  fetchPokemonByTypeAndGetDisplayData: (
    typeId: number,
    typeName: string
  ) => Promise<Array<{
    id: number
    name: string
    sprite: string | null
    primaryType: string
    types?: Array<{ slot: number; type: { name: string; url: string } }>
  }>> // Fetch Pokemon by type and return display-ready data
}

export const usePokemonDataStore = create<PokemonDataState>()(
  persist(
    (set, get) => ({
      // Initial state
      pokemonList: [],
      pokemonDetails: {},
      basicPokemonCache: {},
      currentPokemonId: null,
      bookmarkedPokemonIds: [],
      parentBookmarkedPokemonIds: [],
      loading: false,
      error: null,
      fetchingIds: new Set(),

      /**
       * Fetch the complete Pokemon list (lightweight)
       * Only fetches if list is empty
       */
      fetchPokemonListAction: async () => {
        const state = get()
        
        // Don't fetch if already loaded
        if (state.pokemonList.length > 0) {
          return
        }

        set({ loading: true, error: null })

        try {
          const list = await fetchPokemonList()
          set({ pokemonList: list, loading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Pokemon list'
          set({ error: errorMessage, loading: false })
        }
      },

      /**
       * Fetch complete Pokemon details (with species and evolution chain)
       * Returns cached data if available, otherwise fetches from API
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

        // Check if already fetching this ID
        if (state.fetchingIds.has(id)) {
          // Wait for the existing fetch to complete
          return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
              const currentState = get()
              if (currentState.pokemonDetails[id]) {
                clearInterval(checkInterval)
                resolve(currentState.pokemonDetails[id])
              }
              if (!currentState.fetchingIds.has(id) && !currentState.pokemonDetails[id]) {
                clearInterval(checkInterval)
                reject(new Error(`Failed to fetch Pokemon ${id}`))
              }
            }, 100)
          })
        }

        // Mark as fetching
        set(state => ({
          fetchingIds: new Set([...state.fetchingIds, id]),
          loading: true,
          error: null
        }))

        try {
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
            fetchingIds: new Set([...state.fetchingIds].filter(fId => fId !== id))
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
              !currentStateAfterMain.fetchingIds.has(evoId)
          )

          // Pre-fetch evolution details in background (non-blocking)
          if (evolutionsToFetch.length > 0) {
            // Mark as fetching to prevent duplicate requests
            set((state) => ({
              fetchingIds: new Set([...state.fetchingIds, ...evolutionsToFetch]),
            }))

            // Fetch all evolutions in parallel (non-blocking, fire and forget)
            Promise.allSettled(
              evolutionsToFetch.map(async (evoId) => {
                try {
                  // Fetch full details for this evolution
                  const evoDetail = await fetchCompletePokemonDetail(
                    evoId,
                    get().basicPokemonCache,
                    cacheEvolutionPokemon
                  )

                  // Store in cache
                  set((state) => ({
                    pokemonDetails: {
                      ...state.pokemonDetails,
                      [evoId]: evoDetail,
                    },
                    fetchingIds: new Set(
                      [...state.fetchingIds].filter((fId) => fId !== evoId)
                    ),
                  }))
                } catch (_error) {
                  // Silently fail for background fetches - don't show errors
                  // Remove from fetching set
                  set((state) => ({
                    fetchingIds: new Set(
                      [...state.fetchingIds].filter((fId) => fId !== evoId)
                    ),
                  }))
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
          
          // Remove from fetching set
          set(state => ({
            error: errorMessage,
            loading: false,
            fetchingIds: new Set([...state.fetchingIds].filter(fId => fId !== id))
          }))
          
          throw error
        }
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

      /**
       * Toggle bookmark for a Pokemon
       */
      toggleBookmark: (id: number) => {
        set((state) => {
          const isCurrentlyBookmarked = state.bookmarkedPokemonIds.includes(id)
          const newBookmarkedIds = isCurrentlyBookmarked
            ? state.bookmarkedPokemonIds.filter((bookmarkId) => bookmarkId !== id)
            : [...state.bookmarkedPokemonIds, id]
          
          return { bookmarkedPokemonIds: newBookmarkedIds }
        })
      },

      /**
       * Check if a Pokemon is bookmarked
       */
      isBookmarked: (id: number): boolean => {
        return get().bookmarkedPokemonIds.includes(id)
      },

      /**
       * Get all bookmarked Pokemon details
       */
      getBookmarkedPokemon: (): CombinedPokemonDetail[] => {
        const state = get()
        return state.bookmarkedPokemonIds
          .map((id) => state.pokemonDetails[id])
          .filter((pokemon) => pokemon !== undefined)
      },
      
      /**
       * Toggle parent bookmark
       */
      toggleParentBookmark: (id: number) => {
        set((state) => {
          const currentBookmarks = state.parentBookmarkedPokemonIds
          const isBookmarked = currentBookmarks.includes(id)
          
          const newBookmarkedIds = isBookmarked
            ? currentBookmarks.filter((bookmarkId) => bookmarkId !== id)
            : [...currentBookmarks, id]
          
          return { parentBookmarkedPokemonIds: newBookmarkedIds }
        })
      },
      
      /**
       * Check if a Pokemon is bookmarked by parent
       */
      isParentBookmarked: (id: number): boolean => {
        return get().parentBookmarkedPokemonIds.includes(id)
      },
      
      /**
       * Get all parent bookmarked Pokemon details
       */
      getParentBookmarkedPokemon: (): CombinedPokemonDetail[] => {
        const state = get()
        return state.parentBookmarkedPokemonIds
          .map((id) => state.pokemonDetails[id])
          .filter((pokemon) => pokemon !== undefined)
      },
      
      /**
       * Transform Pokemon list to display-ready data with sprites and types
       */
      getPokemonDisplayData: (
        pokemonList: PokemonListItem[],
        fallbackType?: string
      ) => {
        const state = get()
        return getPokemonDisplayData(
          pokemonList,
          state.pokemonDetails,
          state.basicPokemonCache,
          fallbackType
        )
      },

      /**
       * Fetch Pokemon by type and return display-ready data
       * This combines fetching and enriching in a single operation
       */
      fetchPokemonByTypeAndGetDisplayData: async (
        typeId: number,
        typeName: string
      ) => {
        // Fetch the filtered list from API
        const filteredList = await fetchPokemonByType(typeId)
        const state = get()
        
        // Enrich with cached data and return
        return getPokemonDisplayData(
          filteredList,
          state.pokemonDetails,
          state.basicPokemonCache,
          typeName
        )
      },
    }),
    {
      name: 'pokemon-data-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist list and details, not loading/error states
      partialize: (state) => ({
        pokemonList: state.pokemonList,
        pokemonDetails: state.pokemonDetails,
        basicPokemonCache: state.basicPokemonCache,
        currentPokemonId: state.currentPokemonId,
        bookmarkedPokemonIds: state.bookmarkedPokemonIds,
        parentBookmarkedPokemonIds: state.parentBookmarkedPokemonIds,
      })
    }
  )
)

