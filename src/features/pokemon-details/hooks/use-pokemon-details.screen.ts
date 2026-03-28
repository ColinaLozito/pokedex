import { useGetCachedPokemonDetail } from '@/shared/hooks/useGetCachedPokemonDetail'
import { usePokemonSelect } from '@/shared/hooks/usePokemonSelect'
import { useUserStore } from '@/store/userStore'
import { getPokemonTypeStyles } from '@/utils/pokemon/typeStyles'
import { baseColors } from '@theme/colors'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { UsePokemonDetailsReturn } from '../details.types'
import { usePokemonDetailsGQL } from './use-pokemon-details.hook'

export function usePokemonDetailsScreen(): UsePokemonDetailsReturn {
  const params = useLocalSearchParams<{ id: string }>()

  const pokemonId = params.id ? parseInt(params.id, 10) : null
  const id = pokemonId ?? 0

  const {
    data: pokemonData,
    isLoading,
    isError,
    error,
  } = usePokemonDetailsGQL({
    id,
    enabled: !!id,
  })

  const primaryType = pokemonData?.types?.[0]?.type?.name
  const { typeColor: themeColor } = primaryType
    ? getPokemonTypeStyles(primaryType)
    : { typeColor: baseColors.white }

  const primaryTypeColor = typeof themeColor === 'string' ? themeColor : baseColors.white

  const { bookmarkedPokemonIds, toggleBookmark } = useUserStore(
    useShallow((store) => ({
      bookmarkedPokemonIds: store.bookmarkedPokemonIds,
      toggleBookmark: store.toggleBookmark,
    }))
  )

  const isBookmarked = useMemo(() => {
    return id ? bookmarkedPokemonIds.includes(id) : false
  }, [bookmarkedPokemonIds, id])

  const getPokemonDetail = useGetCachedPokemonDetail()

  const { handleSelect: handleEvolutionPress } = usePokemonSelect({
    pokemonList: pokemonData?.evolutionChain.map(e => ({ id: e.id, name: e.name })),
    skipPrefetch: true,
    replaceNavigation: true,
  })

  const handleBookmarkPress = useCallback(() => {
    if (id) {
      toggleBookmark(id)
    }
  }, [id, toggleBookmark])

  const clearError = useCallback(() => {
    // Error handled by React Query
  }, [])

  const dataMemo = useMemo(() => ({
    currentPokemon: pokemonData,
    isBookmarked,
    primaryTypeColor,
  }), [pokemonData, isBookmarked, primaryTypeColor])

  const statusMemo = useMemo(() => ({
    loading: isLoading,
    error: isError ? (error?.message || 'Failed to load Pokemon') : null,
  }), [isLoading, isError, error])

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
