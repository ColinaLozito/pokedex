import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PokemonListItem, TypeListItem } from 'src/services/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchPokemonByType, fetchPokemonList } from '../services/api'
import { getPokemonDisplayData } from '../utils/getPokemonDisplayData'
import { usePokemonDataStore } from './pokemonDataStore'
import type { PokemonGeneralState } from './types/general'
export type { PokemonGeneralState, RecentSelection } from './types/general'

// PokemonGeneralState moved to src/store/types/general.ts and imported below

const MAX_RECENT_SELECTIONS = 5

const filterStellarType = (list: TypeListItem[]): TypeListItem[] => {
  return list.filter((type) => type.name !== 'stellar')
}

export const usePokemonGeneralStore = create<PokemonGeneralState>()(
  persist(
    (set, get) => ({
       // Initial state
       pokemonList: [],
       typeList: [],
       recentSelections: [],
       bookmarkedPokemonIds: [],

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
       * Set the type list (filters out stellar type)
       */
      setTypeList: (list) => {
        set({ typeList: filterStellarType(list) })
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
       }),
       onRehydrateStorage: () => (state) => {
         if (state) {
           state.typeList = filterStellarType(state.typeList)
         }
       },
    }
  )
)
