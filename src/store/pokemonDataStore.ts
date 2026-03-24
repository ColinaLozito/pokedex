/**
 * Pokemon Data Store
 * 
 * Manages individual Pokemon details with caching, fetch deduplication, and background pre-fetching.
 * 
 * State:
 * - pokemonDetails: Cache of fetched Pokemon details keyed by ID
 * - currentPokemonId: Currently selected Pokemon ID
 * - loading: Loading state for async operations
 * - error: Error state for failed fetches
 * - pendingFetches: Map of in-flight fetch promises for deduplication
 * 
 * Features:
 * - Returns cached data if available
 * - Promise-based deduplication to prevent duplicate API calls
 * - Background pre-fetching of evolution chain Pokemon
 * - Persistent storage for offline access
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CombinedPokemonDetail } from 'src/services/types'
import { showToast } from 'src/utils/ui/toast'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchCompletePokemonDetail } from '../services/api'
import type { PokemonDataState } from './types/pokemon'

const STORAGE_NAME = 'pokemon-data-storage'

export const usePokemonDataStore = create<PokemonDataState>()(
  persist(
    (set, get) => ({
      pokemonDetails: {},
      currentPokemonId: null,
      loading: false,
      error: null,
      pendingFetches: new Map(),

      fetchPokemonDetail: async (id: number): Promise<CombinedPokemonDetail> => {
        const state = get()
        
        const cached = state.pokemonDetails[id]
        if (cached) {
          if (state.currentPokemonId !== id) {
            set({ currentPokemonId: id })
          }
          return cached
        }

        const existingFetch = state.pendingFetches.get(id)
        if (existingFetch) {
          if (state.currentPokemonId !== id) {
            set({ currentPokemonId: id })
          }
          return existingFetch
        }

        set({ error: null })

        const fetchPromise = (async () => {
          try {
            set({ loading: true, error: null })
            
            const detail = await fetchCompletePokemonDetail(id)
            
            set((state) => ({
              pokemonDetails: {
                ...state.pokemonDetails,
                [id]: detail
              },
              currentPokemonId: id,
              loading: false,
            }))

            const evolutionIds = detail.evolutionChain
              .map((evo) => evo.id)
              .filter((evoId) => evoId !== id)

            const evolutionsToFetch = evolutionIds.filter(
              (evoId) =>
                !state.pokemonDetails[evoId] &&
                !state.pendingFetches.has(evoId)
            )

            if (evolutionsToFetch.length > 0) {
              Promise.allSettled(
                evolutionsToFetch.map(async (evoId) => {
                  try {
                    const evoDetail = await fetchCompletePokemonDetail(evoId)
                    set((state) => ({
                      pokemonDetails: {
                        ...state.pokemonDetails,
                        [evoId]: evoDetail,
                      },
                    }))
                  } catch (_error) {
                    /// 
                  }
                })
              ).catch(() => {})
            }

            return detail
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : `Failed to fetch Pokemon ${id}`
            
            showToast('Pokemon Not Found', `Could not load Pokemon #${id}. It may not exist or there was a network error.`)
            
            set({
              error: errorMessage,
              loading: false,
            })
            throw error
          } finally {
            set((state) => {
              const newPendingFetches = new Map(state.pendingFetches)
              newPendingFetches.delete(id)
              return { pendingFetches: newPendingFetches }
            })
          }
        })()

        set((state) => {
          const newPendingFetches = new Map(state.pendingFetches)
          newPendingFetches.set(id, fetchPromise)
          return { pendingFetches: newPendingFetches }
        })

        return fetchPromise
      },

      getPokemonDetail: (id: number) => {
        return get().pokemonDetails[id]
      },

      setCurrentPokemonId: (id: number | null) => {
        set({ currentPokemonId: id })
      },

      getCurrentPokemon: () => {
        const state = get()
        if (state.currentPokemonId === null) return undefined
        return state.pokemonDetails[state.currentPokemonId]
      },

      clearError: () => {
        set({ error: null })
      },

      $reset: () => {
        set({
          pokemonDetails: {},
          currentPokemonId: null,
          loading: false,
          error: null,
          pendingFetches: new Map(),
        })
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pokemonDetails: state.pokemonDetails,
        currentPokemonId: state.currentPokemonId,
      })
    }
  )
)
