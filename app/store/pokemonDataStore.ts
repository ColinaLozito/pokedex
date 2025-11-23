import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PokemonListItem, CombinedPokemonDetail, PokemonDetail } from '../services/api'
import { fetchPokemonList, fetchCompletePokemonDetail, fetchPokemonById } from '../services/api'

// Toast controller will be set from the app
let toastController: any = null

export const setToastController = (controller: any) => {
  toastController = controller
}

const showToast = (title: string, message?: string) => {
  if (toastController) {
    toastController.show(title, { message })
  }
}

interface PokemonDataState {
  // State
  pokemonList: PokemonListItem[] // Lightweight list of all Pokemon
  pokemonDetails: Record<number, CombinedPokemonDetail> // Detailed Pokemon data keyed by ID
  basicPokemonCache: Record<number, PokemonDetail> // Cache for basic Pokemon data (used in evolutions)
  currentPokemonId: number | null // Currently selected Pokemon ID
  bookmarkedPokemonIds: number[] // Array of bookmarked Pokemon IDs
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
          console.log('Pokemon list already loaded, skipping fetch')
          return
        }

        set({ loading: true, error: null })

        try {
          const list = await fetchPokemonList()
          set({ pokemonList: list, loading: false })
          console.log(`Pokemon list loaded: ${list.length} Pokemon`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Pokemon list'
          set({ error: errorMessage, loading: false })
          console.error('Error fetching Pokemon list:', error)
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
          console.log(`Using cached data for Pokemon ID: ${id}`)
          return state.pokemonDetails[id]
        }

        // Check if already fetching this ID
        if (state.fetchingIds.has(id)) {
          console.log(`Already fetching Pokemon ID: ${id}, waiting...`)
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
          console.log(`\n🔍 Fetching complete details for Pokemon ID: ${id}`)
          
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
          
          // Store in cache
          set(state => ({
            pokemonDetails: {
              ...state.pokemonDetails,
              [id]: detail
            },
            loading: false,
            fetchingIds: new Set([...state.fetchingIds].filter(fId => fId !== id))
          }))

          console.log(`✅ Cached Pokemon: ${detail.name} (ID: ${id})`)
          console.log(`✅ Total basic Pokemon cached: ${Object.keys(get().basicPokemonCache).length}`)
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
          
          console.error(`❌ Error fetching Pokemon ${id}:`, error)
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
          console.log(`Using cached basic data for Pokemon ID: ${id}`)
          return state.basicPokemonCache[id]
        }

        try {
          console.log(`Fetching basic Pokemon data for ID: ${id}`)
          const basicData = await fetchPokemonById(id)
          
          // Store in basic cache
          set(state => ({
            basicPokemonCache: {
              ...state.basicPokemonCache,
              [id]: basicData
            }
          }))

          console.log(`✅ Cached basic Pokemon: ${basicData.name} (ID: ${id})`)
          return basicData
        } catch (error) {
          console.error(`Error fetching basic Pokemon ${id}:`, error)
          showToast('Error Loading Pokemon', `Failed to load Pokemon #${id} data`)
          throw error
        }
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
          
          console.log(`[BOOKMARK] ${isCurrentlyBookmarked ? 'Removed' : 'Added'} Pokemon ID: ${id}`)
          console.log('[BOOKMARK] Updated bookmarks:', newBookmarkedIds)
          
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
      }
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
        bookmarkedPokemonIds: state.bookmarkedPokemonIds
      })
    }
  )
)

/**
 * Hook to get Pokemon list
 */
export const usePokemonList = () => {
  const list = usePokemonDataStore(state => state.pokemonList)
  const fetchList = usePokemonDataStore(state => state.fetchPokemonListAction)
  return { list, fetchList }
}

/**
 * Hook to get Pokemon detail with auto-fetch
 */
export const usePokemonDetail = (id: number | null) => {
  const detail = usePokemonDataStore(state => 
    id !== null ? state.pokemonDetails[id] : undefined
  )
  const fetchDetail = usePokemonDataStore(state => state.fetchPokemonDetail)
  const loading = usePokemonDataStore(state => state.loading)
  const error = usePokemonDataStore(state => state.error)
  
  return { detail, fetchDetail, loading, error }
}

/**
 * Hook to get current Pokemon
 */
export const useCurrentPokemon = () => {
  const currentId = usePokemonDataStore(state => state.currentPokemonId)
  const currentPokemon = usePokemonDataStore(state => state.getCurrentPokemon())
  const setCurrentId = usePokemonDataStore(state => state.setCurrentPokemonId)
  
  return { currentId, currentPokemon, setCurrentId }
}

