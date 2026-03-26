import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { UserState, RecentSelection } from './types/user'

const STORAGE_NAME = 'pokemon-user-storage'
const MAX_RECENT_SELECTIONS = 5

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      bookmarkedPokemonIds: [],
      recentSelections: [],

      toggleBookmark: (id: number) => {
        set((state) => {
          const isCurrentlyBookmarked = state.bookmarkedPokemonIds.includes(id)
          const newBookmarkedIds = isCurrentlyBookmarked
            ? state.bookmarkedPokemonIds.filter((bookmarkId) => bookmarkId !== id)
            : [...state.bookmarkedPokemonIds, id]

          return { bookmarkedPokemonIds: newBookmarkedIds }
        })
      },

      addRecentSelection: (pokemon: { id: number; name: string }) => {
        set((state) => {
          const filtered = state.recentSelections.filter((s) => s.id !== pokemon.id)
          const updated: RecentSelection[] = [
            { id: pokemon.id, name: pokemon.name, selectedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_SELECTIONS)

          return { recentSelections: updated }
        })
      },

      removeRecentSelection: (pokemonId: number) => {
        set((state) => ({
          recentSelections: state.recentSelections.filter((s) => s.id !== pokemonId),
        }))
      },

      $reset: () => {
        set({
          bookmarkedPokemonIds: [],
          recentSelections: [],
        })
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookmarkedPokemonIds: state.bookmarkedPokemonIds,
        recentSelections: state.recentSelections,
      }),
    }
  )
)
