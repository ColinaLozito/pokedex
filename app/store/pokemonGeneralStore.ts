import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchPokemonByType, fetchPokemonList } from '../services/api'
import type { PokemonListItem, TypeListItem } from '../services/types'
import type { PokemonDisplayDataArray } from '../utils/pokemonDisplayUtils'
import { getPokemonDisplayData } from '../utils/pokemonDisplayUtils'
import { usePokemonDataStore } from './pokemonDataStore'

export interface RecentSelection {
  id: number
  name: string
  selectedAt: number // timestamp
}

interface PokemonGeneralState {
  // State
  pokemonList: PokemonListItem[] // Lightweight list of all Pokemon
  typeList: TypeListItem[] // Complete list of Pokémon types from API
  recentSelections: RecentSelection[] // Last 5 selected Pokémon
  bookmarkedPokemonIds: number[] // Array of bookmarked Pokemon IDs (for kid)
  parentBookmarkedPokemonIds: number[] // Array of bookmarked Pokemon IDs (for parent)

  // Actions
  fetchPokemonListAction: () => Promise<void>
  setTypeList: (list: TypeListItem[]) => void
  addRecentSelection: (pokemon: PokemonListItem) => void
  removeRecentSelection: (pokemonId: number) => void
  toggleBookmark: (id: number) => void
  toggleParentBookmark: (id: number) => void
  
  // Helper methods (these need access to pokemonDataStore for details)
  getPokemonDisplayData: (
    pokemonList: PokemonListItem[],
    fallbackType?: string
  ) => PokemonDisplayDataArray // Transform Pokemon list to display-ready data with sprites and types
  fetchPokemonByTypeAndGetDisplayData: (
    typeId: number,
    typeName: string
  ) => Promise<PokemonDisplayDataArray> // Fetch Pokemon by type and return display-ready data
}

const MAX_RECENT_SELECTIONS = 5

export const usePokemonGeneralStore = create<PokemonGeneralState>()(
  persist(
    (set, get) => ({
      // Initial state
      pokemonList: [],
      typeList: [],
      recentSelections: [],
      bookmarkedPokemonIds: [],
      parentBookmarkedPokemonIds: [],

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

        try {
          const list = await fetchPokemonList()
          set({ pokemonList: list })
        } catch (_error) {
          // Error is handled silently - list will remain empty
        }
      },

      /**
       * Set the type list
       */
      setTypeList: (list) => {
        // Filter out stellar type for now
        const filteredList = list.filter((type) => type.name !== 'stellar')
        set({ typeList: filteredList })
      },

      /**
       * Add a Pokemon to recent selections
       */
      addRecentSelection: (pokemon) => {
        set((state) => {
          // Remove if already exists to avoid duplicates
          const filtered = state.recentSelections.filter((s) => s.id !== pokemon.id)
          // Add to the beginning with timestamp
          const updated = [
            { id: pokemon.id, name: pokemon.name, selectedAt: Date.now() },
            ...filtered
          ].slice(0, MAX_RECENT_SELECTIONS)

          return { recentSelections: updated }
        })
      },

      /**
       * Remove a Pokemon from recent selections
       */
      removeRecentSelection: (pokemonId) => {
        set((state) => ({
          recentSelections: state.recentSelections.filter((s) => s.id !== pokemonId),
        }))
      },

      /**
       * Toggle bookmark for a Pokemon (kid)
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
       * Transform Pokemon list to display-ready data with sprites and types
       * Note: This method needs access to pokemonDataStore for details
       */
      getPokemonDisplayData: (
        pokemonList: PokemonListItem[],
        fallbackType?: string
      ) => {
        // Cache pokemonDataState to avoid multiple .getState() calls
        const pokemonDataState = usePokemonDataStore.getState()
        
        return getPokemonDisplayData(
          pokemonList,
          pokemonDataState.pokemonDetails,
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
        // Cache pokemonDataState to avoid multiple .getState() calls
        const pokemonDataState = usePokemonDataStore.getState()
        
        // Enrich with cached data and return
        return getPokemonDisplayData(
          filteredList,
          pokemonDataState.pokemonDetails,
          typeName
        )
      },
    }),
    {
      name: 'pokemon-general-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pokemonList: state.pokemonList,
        typeList: state.typeList,
        recentSelections: state.recentSelections,
        bookmarkedPokemonIds: state.bookmarkedPokemonIds,
        parentBookmarkedPokemonIds: state.parentBookmarkedPokemonIds,
      })
    }
  )
)

