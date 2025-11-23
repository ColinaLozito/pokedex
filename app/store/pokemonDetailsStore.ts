import { create } from 'zustand'
import type { PokemonDetail } from '../services/api'

interface PokemonDetailsState {
  // State
  currentPokemon: PokemonDetail | null
  cachedPokemon: Record<number, PokemonDetail> // Cache by ID for reuse
  isLoading: boolean
  error: string | null

  // Actions
  setCurrentPokemon: (pokemon: PokemonDetail) => void
  cachePokemon: (pokemon: PokemonDetail) => void
  getCachedPokemon: (id: number) => PokemonDetail | undefined
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearCurrentPokemon: () => void
}

export const usePokemonDetailsStore = create<PokemonDetailsState>((set, get) => ({
  // Initial state
  currentPokemon: null,
  cachedPokemon: {},
  isLoading: false,
  error: null,

  // Actions
  setCurrentPokemon: (pokemon) => {
    set({ currentPokemon: pokemon, error: null })
    // Also cache it
    get().cachePokemon(pokemon)
  },

  cachePokemon: (pokemon) =>
    set((state) => ({
      cachedPokemon: {
        ...state.cachedPokemon,
        [pokemon.id]: pokemon,
      },
    })),

  getCachedPokemon: (id) => {
    return get().cachedPokemon[id]
  },

  setLoading: (loading) =>
    set({ isLoading: loading }),

  setError: (error) =>
    set({ error }),

  clearCurrentPokemon: () =>
    set({ currentPokemon: null, error: null }),
}))

