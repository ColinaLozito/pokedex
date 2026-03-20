import type { CombinedPokemonDetail } from 'src/services/types'
import type { PokemonListItem, TypeListItem } from 'src/services/types'

export interface PokemonDataState {
  pokemonDetails: Record<number, CombinedPokemonDetail>
  currentPokemonId: number | null
  loading: boolean
  error: string | null
  pendingFetches: Map<number, Promise<CombinedPokemonDetail>>

  fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  setCurrentPokemonId: (id: number | null) => void
  getCurrentPokemon: () => CombinedPokemonDetail | undefined
  clearError: () => void
}
