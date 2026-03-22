import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { NAVIGATION_DELAY } from '@/utils/modalConstants'
import { setToastController } from '@/utils/toast'
import { useToastController } from '@tamagui/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function usePokemonSelection() {
  const router = useRouter()
  const toast = useToastController()

  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)

  const pokemonList = usePokemonGeneralStore((state) => state.pokemonList)
  const addRecentSelection = usePokemonGeneralStore((state) => state.addRecentSelection)

  const [isFetchingPokemon, setIsFetchingPokemon] = useState(false)
  const [pendingNavigationId, setPendingNavigationId] = useState<number | null>(null)

  const pokemonListDataSet = useMemo(() => 
    pokemonList.map((pokemon) => ({
      id: pokemon.id.toString(),
      title: pokemon.name,
    })), [pokemonList]
  )

  useEffect(() => {
    setToastController(toast)
  }, [toast])

  const handleSelectItem = useCallback(async (id: number) => {
    if (!id || id === 0 || isNaN(id)) {
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }

    const selectedPokemon = pokemonList.find((pokemon) => pokemon.id === id)
    const isCached = getPokemonDetail(id) !== undefined

    if (!isCached) {
      setIsFetchingPokemon(true)
    }

    try {
      await fetchPokemonDetail(id)
      
      if (selectedPokemon) {
        addRecentSelection(selectedPokemon)
      }
      
      if (!isCached) {
        setPendingNavigationId(id)
      } else {
        router.push({ pathname: '/pokemonDetails' })
      }
    } catch (_error) {
      setIsFetchingPokemon(false)
      setPendingNavigationId(null)
    } finally {
      if (!isCached) {
        setIsFetchingPokemon(false)
      }
    }
  }, [pokemonList, fetchPokemonDetail, addRecentSelection, router, toast, getPokemonDetail])

  useEffect(() => {
    if (!isFetchingPokemon && pendingNavigationId !== null) {
      const timer = setTimeout(() => {
        router.push({ pathname: '/pokemonDetails' })
        setPendingNavigationId(null)
      }, NAVIGATION_DELAY)
      
      return () => clearTimeout(timer)
    }
  }, [isFetchingPokemon, pendingNavigationId, router])

  return {
    isFetchingPokemon,
    pokemonListDataSet,
    handleSelectItem,
    getPokemonDetail,
  }
}
