 
import type { PokemonListItem } from '@/shared/types/pokemon.domain'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { getCachedPokemonDetail } from './useGetCachedPokemonDetail'
import { useModal } from './useModal'
import { prefetchPokemonDetails } from './usePokemonPrefetch'
import { toast } from '@/shared/utils/tamaguiToast'

export interface UsePokemonSelectOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection?: (pokemon: PokemonListItem) => void
  skipPrefetch?: boolean
  replaceNavigation?: boolean
}

export interface UsePokemonSelectReturn {
  handleSelect: (id: number) => Promise<void>
}

export function usePokemonSelect({
  pokemonList,
  addRecentSelection,
  skipPrefetch = false,
  replaceNavigation = false,
}: UsePokemonSelectOptions = {}): UsePokemonSelectReturn {
  const router = useRouter()
  const { showLoading, dismiss: dismissModal } = useModal()

  const handleSelect = useCallback(async (id: number) => {
    if (!id || id === 0 || isNaN(id)) {
      toast.warning('Invalid Selection', {
        description: 'Please select a valid Pokemon',
      })
      return
    }

    const selectedPokemon = pokemonList?.find((p) => p.id === id)

    // Check if data is cached - if so, navigate instantly
    const isCached = !!getCachedPokemonDetail(id)

    if (isCached || skipPrefetch) {
      if (selectedPokemon && addRecentSelection) {
        addRecentSelection(selectedPokemon)
      }
      if (replaceNavigation) {
        router.replace({ 
          pathname: '/pokemonDetails', 
          params: { id: id.toString() } 
        })
      } else {
        router.push({ 
          pathname: '/pokemonDetails', 
          params: { id: id.toString() } 
        })
      }
      return
    } else {
      // NOT cached - show loading modal while fetching
      showLoading('Loading Pokémon...')
    }

    try {
      await prefetchPokemonDetails(id)

      if (selectedPokemon && addRecentSelection) {
        addRecentSelection(selectedPokemon)
      }

      // Dismiss modal first
      dismissModal()

      // Then navigate
      if (replaceNavigation) {
        router.replace({ 
          pathname: '/pokemonDetails', 
          params: { id: id.toString() } 
        })
      } else {
        router.push({ 
          pathname: '/pokemonDetails', 
          params: { id: id.toString() } 
        })
      }
    } catch (_error) {
      dismissModal()
    }
  }, [
    pokemonList, 
    addRecentSelection, 
    showLoading, 
    dismissModal, 
    router, 
    skipPrefetch, 
    replaceNavigation
  ])

  return {
    handleSelect,
  }
}
