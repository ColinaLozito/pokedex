import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  generateRandomPokemonId,
  getTodayDateString,
  isNewDay,
} from '../utils/dateUtils'

interface DailyPokemonState {
  // State
  dailyPokemonId: number | null // Daily random Pokemon ID
  dailyPokemonDate: string | null // Date string (YYYY-MM-DD) when daily Pokemon was set
  rerollCount: number // Number of rerolls today
  rerollDate: string | null // Date string (YYYY-MM-DD) for reroll tracking

  // Actions
  getDailyPokemon: () => Promise<number> // Get or generate daily Pokemon ID
  setDailyPokemonId: (id: number) => void // Set daily Pokemon ID (from roulette)
  rerollDailyPokemon: () => Promise<number> // Reroll to new random Pokemon (legacy)
  getRerollCount: () => number // Get today's reroll count
}

export const useDailyPokemonStore = create<DailyPokemonState>()(
  persist(
    (set, get) => ({
      // Initial state
      dailyPokemonId: null,
      dailyPokemonDate: null,
      rerollCount: 0,
      rerollDate: null,

      /**
       * Get or generate daily Pokemon ID
       * Resets if it's a new day
       */
      getDailyPokemon: async (): Promise<number> => {
        const state = get()
        const today = getTodayDateString()

        // Check if we need to reset (new day)
        if (isNewDay(state.dailyPokemonDate)) {
          const newId = generateRandomPokemonId()
          set({
            dailyPokemonId: newId,
            dailyPokemonDate: today,
            rerollCount: 0,
            rerollDate: today,
          })
          return newId
        }

        // If we have a daily Pokemon for today, return it
        if (state.dailyPokemonId && state.dailyPokemonDate === today) {
          return state.dailyPokemonId
        }

        // Generate new daily Pokemon
        const newId = generateRandomPokemonId()
        set({
          dailyPokemonId: newId,
          dailyPokemonDate: today,
          rerollCount: 0,
          rerollDate: today,
        })
        return newId
      },

      /**
       * Set daily Pokemon ID (used when roulette completes)
       * Increments reroll count if same day
       */
      setDailyPokemonId: (id: number) => {
        const state = get()
        const today = getTodayDateString()

        // Reset reroll count if new day
        if (state.rerollDate !== today) {
          set({
            rerollCount: 1,
            rerollDate: today,
            dailyPokemonId: id,
            dailyPokemonDate: today,
          })
        } else {
          // Increment reroll count
          set({
            rerollCount: state.rerollCount + 1,
            dailyPokemonId: id,
            dailyPokemonDate: today,
          })
        }
      },

      /**
       * Reroll to a new random Pokemon (legacy - kept for compatibility)
       * Increments reroll count if same day
       */
      rerollDailyPokemon: async (): Promise<number> => {
        const state = get()
        const newId = generateRandomPokemonId()
        state.setDailyPokemonId(newId)
        return newId
      },

      /**
       * Get today's reroll count
       */
      getRerollCount: (): number => {
        const state = get()
        const today = getTodayDateString()

        // Reset if new day
        if (state.rerollDate !== today) {
          return 0
        }

        return state.rerollCount
      },
    }),
    {
      name: 'daily-pokemon-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dailyPokemonId: state.dailyPokemonId,
        dailyPokemonDate: state.dailyPokemonDate,
        rerollCount: state.rerollCount,
        rerollDate: state.rerollDate,
      }),
    }
  )
)

