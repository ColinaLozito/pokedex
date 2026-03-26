import type { PokemonListItem } from 'src/services/types'
import { usePokemonSelect } from './usePokemonSelect'

interface UsePokemonSelectionOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection?: (pokemon: PokemonListItem) => void
  pokemonListDataSet?: Array<{ id: string; title: string }>
}

interface UsePokemonSelectionReturn {
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
