import type { PokemonListItem } from 'src/shared/types/pokemon.domain'
import { usePokemonSelect } from './usePokemonSelect'

export interface UsePokemonSelectionOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection?: (pokemon: PokemonListItem) => void
  pokemonListDataSet?: Array<{ id: string; title: string }>
}

export interface UsePokemonSelectionReturn {
  isLoading: boolean
  pokemonListDataSet?: Array<{ id: string; title: string }>
  handleSelect: (id: number) => Promise<void>
}

export function usePokemonSelection({
  pokemonList,
  addRecentSelection,
  pokemonListDataSet,
}: UsePokemonSelectionOptions = {}): UsePokemonSelectionReturn {
  const { handleSelect } = usePokemonSelect({
    pokemonList,
    addRecentSelection,
  })

  return {
    isLoading: false,
    pokemonListDataSet,
    handleSelect,
  }
}
