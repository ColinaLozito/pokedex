import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import type { PokemonListItem } from 'src/services/types'
import { setToastController } from 'src/utils/ui/toast'
import { prefetchPokemonDetails } from './usePokemonPrefetch'
import { getCachedPokemonDetail } from './useGetCachedPokemonDetail'
import { useModal } from './useModal'

interface UsePokemonSelectOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection?: (pokemon: PokemonListItem) => void
  skipPrefetch?: boolean
  replaceNavigation?: boolean
}

interface UsePokemonSelectReturn {
  handleSelect: (id: number) => Promise<void>
}

export function usePokemonSelect({
  pokemonList,
  addRecentSelection,
  skipPrefetch = false,
  replaceNavigation = false,
}: UsePokemonSelectOptions = {}): UsePokemonSelectReturn {
  const router = useRouter()
  const toast = useToastController()
  const { showLoading, dismiss: dismissModal } = useModal()

  const [pendingNavigationId, setPendingNavigationId] = useState<number | null>(null)

  useEffect(() => {
    setToastController(toast)
  }, [toast])

  const handleSelect = useCallback(async (id: number) => {
    if (!id || id === 0 || isNaN(id)) {
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }

    const selectedPokemon = pokemonList?.find((p) => p.id === id)
    const isCached = !!getCachedPokemonDetail(id)

    if (isCached) {
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
    }

    if (skipPrefetch) {
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
    }

    showLoading('Loading Pokémon...')

    try {
      await prefetchPokemonDetails(id)

      if (selectedPokemon && addRecentSelection) {
        addRecentSelection(selectedPokemon)
      }

      setPendingNavigationId(id)
    } catch (_error) {
      dismissModal()
      setPendingNavigationId(null)
    }
  }, [pokemonList, addRecentSelection, toast, showLoading, dismissModal, router, skipPrefetch, replaceNavigation])

  useEffect(() => {
    if (pendingNavigationId !== null) {
      dismissModal()
      
      const timer = setTimeout(() => {
        if (replaceNavigation) {
          router.replace({ 
            pathname: '/pokemonDetails', 
            params: { id: pendingNavigationId.toString() } 
          })
        } else {
          router.push({ 
            pathname: '/pokemonDetails', 
            params: { id: pendingNavigationId.toString() } 
          })
        }
        setPendingNavigationId(null)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pendingNavigationId, router, dismissModal, replaceNavigation])

  return {
    handleSelect,
  }
}
