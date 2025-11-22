import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PokemonListItem } from '../services/api'

export interface Pokemon {
  id: number
  name: string
  [key: string]: any
}

interface PokemonState {
  // State
  dailyPokemon: Pokemon | null
  bookmarks: Pokemon[]
  discovered: Record<number, number> // Pokemon ID -> count
  recentSearches: string[] // Last 5 searches
  pokemonList: PokemonListItem[] // Complete list of Pokémon from API
  cachedLists: {
    types?: any[]
    generations?: any[]
  }

  // Actions
  setDailyPokemon: (pokemon: Pokemon | null) => void
  addBookmark: (pokemon: Pokemon) => void
  removeBookmark: (pokemonId: number) => void
  addDiscovered: (pokemonId: number) => void
  addRecentSearch: (search: string) => void
  clearRecentSearches: () => void
  setPokemonList: (list: PokemonListItem[]) => void
  setCachedList: (key: 'types' | 'generations', data: any[]) => void
}

const MAX_RECENT_SEARCHES = 5

export const usePokemonStore = create<PokemonState>()(
  persist(
    (set) => ({
      // Initial state
      dailyPokemon: null,
      bookmarks: [],
      discovered: {},
      recentSearches: [],
      pokemonList: [],
      cachedLists: {},

      // Actions
      setDailyPokemon: (pokemon) =>
        set({ dailyPokemon: pokemon }),

      addBookmark: (pokemon) =>
        set((state) => {
          const exists = state.bookmarks.some((b) => b.id === pokemon.id)
          if (exists) return state
          return {
            bookmarks: [...state.bookmarks, pokemon],
          }
        }),

      removeBookmark: (pokemonId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== pokemonId),
        })),

      addDiscovered: (pokemonId) =>
        set((state) => ({
          discovered: {
            ...state.discovered,
            [pokemonId]: (state.discovered[pokemonId] || 0) + 1,
          },
        })),

      addRecentSearch: (search) =>
        set((state) => {
          const trimmedSearch = search.trim().toLowerCase()
          if (!trimmedSearch) return state

          const filtered = state.recentSearches.filter((s) => s !== trimmedSearch)
          const updated = [trimmedSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)

          return { recentSearches: updated }
        }),

      clearRecentSearches: () =>
        set({ recentSearches: [] }),

      setPokemonList: (list) =>
        set({ pokemonList: list }),

      setCachedList: (key, data) =>
        set((state) => ({
          cachedLists: {
            ...state.cachedLists,
            [key]: data,
          },
        })),
    }),
    {
      name: 'pokemon-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

