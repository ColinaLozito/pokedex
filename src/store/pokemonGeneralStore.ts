/**
 * Pokemon General Store
 * 
 * Manages Pokemon lists, types, bookmarks, and recent selections.
 * 
 * State:
 * - pokemonList: Complete list of Pokemon (lightweight)
 * - typeList: Available Pokemon types (filtered)
 * - recentSelections: Last 5 viewed Pokemon
 * - bookmarkedPokemonIds: List of bookmarked Pokemon IDs
 * - pokemonByType: Cache of Pokemon grouped by type
 * 
 * Features:
 * - Fetches and caches Pokemon lists
 * - Filters types (removes 'stellar' type)
 * - Manages recent selections (max 5)
 * - Toggle bookmarks for favorite Pokemon
 * - Type-based Pokemon filtering with caching
 * - Cross-store access to pokemonDataStore for display data
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PokemonType } from '@theme/pokemonTypes'
import type { PokemonListItem, TypeListItem } from 'src/services/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { fetchPokemonByType, fetchPokemonList } from '../services/api'
import { getPokemonDisplayData } from '../utils/pokemon/displayData'
import { usePokemonDataStore } from './pokemonDataStore'
import type { PokemonGeneralState } from './types/general'
export type { PokemonGeneralState, RecentSelection } from './types/general'

const STORAGE_NAME = 'pokemon-general-storage'
const MAX_RECENT_SELECTIONS = 5
const STELLAR_TYPE = 'stellar'

const filterStellarType = (list: TypeListItem[]): TypeListItem[] => {
  return list.filter((type) => type.name !== STELLAR_TYPE)
}

export const usePokemonGeneralStore = create<PokemonGeneralState>()(
  persist(
    (set, get) => ({
      pokemonList: [],
      typeList: [],
      recentSelections: [],
      bookmarkedPokemonIds: [],
      pokemonByType: {} as Record<PokemonType, PokemonListItem[]>,

      fetchPokemonListAction: async () => {
        const state = get()
        if (state.pokemonList.length > 0) {
          return
        }

        try {
          const list = await fetchPokemonList()
          set({ pokemonList: list })
        } catch (_error) {
          /// 
        }
      },

      setTypeList: (list: TypeListItem[]) => {
        set({ typeList: filterStellarType(list) })
      },

      addRecentSelection: (pokemon: PokemonListItem) => {
        set((state) => {
          const filtered = state.recentSelections.filter((s) => s.id !== pokemon.id)
          const updated = [
            { id: pokemon.id, name: pokemon.name, selectedAt: Date.now() },
            ...filtered
          ].slice(0, MAX_RECENT_SELECTIONS)

          return { recentSelections: updated }
        })
      },

      removeRecentSelection: (pokemonId: number) => {
        set((state) => ({
          recentSelections: state.recentSelections.filter((s) => s.id !== pokemonId),
        }))
      },

      toggleBookmark: (id: number) => {
        set((state) => {
          const isCurrentlyBookmarked = state.bookmarkedPokemonIds.includes(id)
          const newBookmarkedIds = isCurrentlyBookmarked
            ? state.bookmarkedPokemonIds.filter((bookmarkId) => bookmarkId !== id)
            : [...state.bookmarkedPokemonIds, id]
          
          return { bookmarkedPokemonIds: newBookmarkedIds }
        })
      },

      clearTypeCache: (typeName?: PokemonType) => {
        set((state) => {
          if (typeName) {
            const { [typeName]: _, ...rest } = state.pokemonByType
            return { pokemonByType: rest as Record<PokemonType, PokemonListItem[]> }
          }
          return { pokemonByType: {} as Record<PokemonType, PokemonListItem[]> }
        })
      },

      isTypeCached: (typeName: PokemonType) => {
        const state = get()
        return !!state.pokemonByType[typeName] && state.pokemonByType[typeName].length > 0
      },
      
      getPokemonDisplayData: (
        pokemonList: PokemonListItem[],
        fallbackType?: string
      ) => {
        const pokemonDataState = usePokemonDataStore.getState()
        
        return getPokemonDisplayData(
          pokemonList,
          pokemonDataState.pokemonDetails,
          fallbackType
        )
      },

      fetchPokemonByTypeAndGetDisplayData: async (
        typeId: number,
        typeName: PokemonType
      ) => {
        const state = get()
        const cached = state.pokemonByType[typeName]
        
        if (cached && cached.length > 0) {
          const pokemonDataState = usePokemonDataStore.getState()
          return getPokemonDisplayData(
            cached,
            pokemonDataState.pokemonDetails,
            typeName
          )
        }

        const filteredList = await fetchPokemonByType(typeId)
        
        set((state) => ({
          pokemonByType: {
            ...state.pokemonByType,
            [typeName]: filteredList,
          },
        }))
        
        const pokemonDataState = usePokemonDataStore.getState()
        return getPokemonDisplayData(
          filteredList,
          pokemonDataState.pokemonDetails,
          typeName
        )
      },

      $reset: () => {
        set({
          pokemonList: [],
          typeList: [],
          recentSelections: [],
          bookmarkedPokemonIds: [],
          pokemonByType: {} as Record<PokemonType, PokemonListItem[]>,
        })
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pokemonList: state.pokemonList,
        typeList: state.typeList,
        recentSelections: state.recentSelections,
        bookmarkedPokemonIds: state.bookmarkedPokemonIds,
        pokemonByType: state.pokemonByType,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.typeList = filterStellarType(state.typeList)
        }
      },
    }
  )
)
