import { baseColors } from '@theme/colors'
import { useCallback, useMemo } from 'react'
import { getPokemonTypeStyles } from 'src/utils/pokemonThemeUtils'
import type { UsePokemonDetailsScreenReturn } from '../types'
import { usePokemonDetailsData } from './usePokemonDetailsData'

export function usePokemonDetailsScreen(): UsePokemonDetailsScreenReturn {
  const { data, status, actions } = usePokemonDetailsData()

  const primaryType = data.currentPokemon?.types?.[0]?.type?.name
  const { typeColor: themeColor } = primaryType
    ? getPokemonTypeStyles(primaryType)
    : { typeColor: baseColors.white }

  const handleBookmarkPress = useCallback(() => {
    if (data.currentPokemon) {
      actions.toggleBookmark(data.currentPokemon.id)
    }
  }, [data.currentPokemon, actions])

  const handleEvolutionPress = useCallback(async (pokemonId: number) => {
    if (pokemonId === data.currentPokemonId) {
      return
    }
    try {
      await actions.fetchPokemonDetail(pokemonId)
    } catch {
      // Error toast handled by store
    }
  }, [data.currentPokemonId, actions])

  const dataMemo = useMemo(() => ({
    currentPokemon: data.currentPokemon,
    isBookmarked: data.isBookmarked,
    primaryTypeColor: themeColor,
  }), [data.currentPokemon, data.isBookmarked, themeColor])

  const statusMemo = useMemo(() => ({
    loading: status.loading,
    error: status.error,
  }), [status.loading, status.error])

  const actionsMemo = useMemo(() => ({
    handleEvolutionPress,
    handleBookmarkPress,
    clearError: actions.clearError,
    getPokemonDetail: actions.getPokemonDetail,
  }), [handleEvolutionPress, handleBookmarkPress, actions.clearError, actions.getPokemonDetail])

  return {
    data: dataMemo,
    status: statusMemo,
    actions: actionsMemo,
  }
}

