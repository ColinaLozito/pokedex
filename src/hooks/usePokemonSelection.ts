import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import type { PokemonListItem } from 'src/services/types'

interface UsePokemonSelectionOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection?: (pokemon: PokemonListItem) => void
  fetchPokemonDetail?: (id: number) => Promise<unknown>
  getPokemonDetail?: (id: number) => unknown
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
  const router = useRouter()
  const toast = useToastController()

  const handleSelect = useCallback(async (id: number) => {
    if (!id || id === 0 || isNaN(id)) {
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }

    const selectedPokemon = pokemonList?.find((p) => p.id === id)

    if (selectedPokemon && addRecentSelection) {
      addRecentSelection(selectedPokemon)
    }

    router.push({ pathname: '/pokemonDetails', params: { id: id.toString() } })
  }, [pokemonList, addRecentSelection, router, toast])

  return {
    isLoading: false,
    pokemonListDataSet,
    handleSelect,
  }
}
