import { baseColors } from '@theme/colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { getPokemonTypeStyles } from 'src/utils/pokemon/typeStyles'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import type { UsePokemonDetailsV2Return } from '../types'

export function usePokemonDetailsV2Screen(): UsePokemonDetailsV2Return {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string }>()

  const pokemonId = params.id ? parseInt(params.id, 10) : null
  const id = pokemonId ?? 0

  const { 
    pokemonDetails, 
    loading, 
    error,
    fetchPokemonDetail,
    getPokemonDetail,
    clearError,
  } = usePokemonDataStore(
    useShallow(store => ({
      pokemonDetails: store.pokemonDetails,
      loading: store.loading,
      error: store.error,
      fetchPokemonDetail: store.fetchPokemonDetail,
      getPokemonDetail: store.getPokemonDetail,
      clearError: store.clearError,
    }))
  )

  const pokemonData = id ? pokemonDetails[id] : undefined

  const primaryType = pokemonData?.types?.[0]?.type?.name
  const { typeColor: themeColor } = primaryType
    ? getPokemonTypeStyles(primaryType)
    : { typeColor: baseColors.white }

  const bookmarkedPokemonIds = usePokemonGeneralStore((store) => store.bookmarkedPokemonIds)
  const toggleBookmark = usePokemonGeneralStore((store) => store.toggleBookmark)

  const isBookmarked = useMemo(() => {
    return id ? bookmarkedPokemonIds.includes(id) : false
  }, [bookmarkedPokemonIds, id])

  useEffect(() => {
    if (id && !pokemonData) {
      fetchPokemonDetail(id)
    }
  }, [id, pokemonData, fetchPokemonDetail])

  const handleBookmarkPress = useCallback(() => {
    if (id) {
      toggleBookmark(id)
    }
  }, [id, toggleBookmark])

  const handleEvolutionPress = useCallback(async (evolutionId: number) => {
    if (evolutionId === id) {
      return
    }
    
    const cached = getPokemonDetail(evolutionId)
    if (!cached) {
      await fetchPokemonDetail(evolutionId)
    }
    
    router.replace({
      pathname: '/pokemonDetailsV2',
      params: { id: evolutionId.toString() },
    })
  }, [id, router, fetchPokemonDetail, getPokemonDetail])

  const dataMemo = useMemo(() => ({
    currentPokemon: pokemonData,
    isBookmarked,
    primaryTypeColor: themeColor,
  }), [pokemonData, isBookmarked, themeColor])

  const statusMemo = useMemo(() => ({
    loading: loading,
    error: error,
  }), [loading, error])

  const actionsMemo = useMemo(() => ({
    handleEvolutionPress,
    handleBookmarkPress,
    clearError,
    getPokemonDetail,
  }), [handleEvolutionPress, handleBookmarkPress, clearError, getPokemonDetail])

  return {
    data: dataMemo,
    status: statusMemo,
    actions: actionsMemo,
  }
}
