import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  getTodayDateString,
} from '../utils/dateUtils'

interface DailyPokemonState {
  // State
  dailyPokemonId: number | null // Daily random Pokemon ID
  dailyPokemonDate: string | null // Date string (YYYY-MM-DD) when daily Pokemon was set
  rerollCount: number // Number of rerolls today
  rerollDate: string | null // Date string (YYYY-MM-DD) for reroll tracking

  // Actions
  setDailyPokemonId: (id: number) => void // Set daily Pokemon ID (from roulette)
  getRerollCount: () => number // Get today's reroll count
  setRerollCount: () => void // Set reroll count
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
       * Set daily Pokemon ID (used when roulette completes)
       * Increments reroll count if same day
       */
      setDailyPokemonId: (id: number) => {
        const today = getTodayDateString()

        set({
          dailyPokemonId: id,
          dailyPokemonDate: today,
        })
      },
      
      /**
       * Set reroll count
      */
      setRerollCount: () => {
        const state = get()
        const today = getTodayDateString()
        
        if (state.rerollDate !== today) {
          set({
            rerollCount: 0,
            rerollDate: today,
          })
        }
        
        set({
          rerollCount: state.rerollCount + 1,
        })
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

