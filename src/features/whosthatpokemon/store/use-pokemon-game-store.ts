import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface PokemonGameState {
  totalPlayed: number
  correctGuesses: number
  recordGameOutcome: (isCorrect: boolean) => void
  $reset: () => void
}

export const usePokemonGameStore = create<PokemonGameState>()(
  persist(
    (set) => ({
      totalPlayed: 0,
      correctGuesses: 0,
      recordGameOutcome: (isCorrect: boolean) => {
        set((state) => ({
          totalPlayed: state.totalPlayed + 1,
          correctGuesses: state.correctGuesses + (isCorrect ? 1 : 0),
        }))
      },
      $reset: () => set({ totalPlayed: 0, correctGuesses: 0 }),
    }),
    {
      name: 'pokemon-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
