import { NAVIGATION_DELAY } from '@/modals/constants'
import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import type { CombinedPokemonDetail, PokemonListItem } from 'src/services/types'
import { setToastController } from 'src/utils/ui/toast'

interface UsePokemonSelectionOptions {
  pokemonList?: PokemonListItem[]
  addRecentSelection: (pokemon: PokemonListItem) => void
  fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
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
  fetchPokemonDetail,
  getPokemonDetail,
  pokemonListDataSet,
}: UsePokemonSelectionOptions): UsePokemonSelectionReturn {
  const router = useRouter()
  const toast = useToastController()

  const [isLoading, setIsLoading] = useState(false)
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
    const isCached = getPokemonDetail(id) !== undefined

    if (!isCached) {
      setIsLoading(true)
    }

    try {
      await fetchPokemonDetail(id)

      if (selectedPokemon) {
        addRecentSelection(selectedPokemon)
      }

      if (!isCached) {
        setPendingNavigationId(id)
      } else {
        router.push({ pathname: '/pokemonDetailsV2', params: { id: id.toString() } })
      }
    } catch (_error) {
      setIsLoading(false)
      setPendingNavigationId(null)
    } finally {
      if (!isCached) {
        setIsLoading(false)
      }
    }
  }, [pokemonList, fetchPokemonDetail, addRecentSelection, router, toast, getPokemonDetail])

  useEffect(() => {
    if (!isLoading && pendingNavigationId !== null) {
      const timer = setTimeout(() => {
        router.push({ pathname: '/pokemonDetailsV2', params: { id: pendingNavigationId.toString() } })
        setPendingNavigationId(null)
      }, NAVIGATION_DELAY)

      return () => clearTimeout(timer)
    }
  }, [isLoading, pendingNavigationId, router])

  return {
    isLoading,
    pokemonListDataSet,
    handleSelect,
  }
}
