import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import { getPokemonTypeStyles } from 'src/utils/pokemon/typeStyles'
import type { UseTypeFilterScreenReturn } from '../types'
import { useTypeFilterData } from './useTypeFilterData'
import { POKEMON_TYPES, type PokemonType } from '@theme/pokemonTypes'

const isValidPokemonType = (type: string): type is PokemonType => {
  return Object.values(POKEMON_TYPES).includes(type as PokemonType)
}

export function useTypeFilterScreen(): UseTypeFilterScreenReturn {
  const router = useRouter()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()

  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeNameRaw = params.typeName || 'normal'
  const typeName = isValidPokemonType(typeNameRaw) ? typeNameRaw : 'normal'

  const { data, status, actions } = useTypeFilterData(typeId, typeName)

  const { typeColor, typeIcon } = getPokemonTypeStyles(typeName)

  const onGoBack = useCallback(() => router.back(), [router])

  useEffect(() => {
    actions.loadPokemon()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.loadPokemon])

  const dataMemo = useMemo(() => ({
    filteredData: data.filteredData,
    pokemonListForRecent: data.pokemonListForRecent,
    typeName,
    typeColor,
    typeIcon,
    hasMore: data.hasMore,
  }), [data.filteredData, data.pokemonListForRecent, typeName, typeColor, typeIcon, data.hasMore])

  const statusMemo = useMemo(() => ({
    loading: status.loading,
    isLoading: status.isLoading,
    error: status.error,
    isCached: status.isCached,
  }), [status.loading, status.isLoading, status.error, status.isCached])

  const actionsMemo = useMemo(() => ({
    handleSelect: actions.handleSelect,
    onGoBack,
    loadMore: actions.loadMore,
  }), [actions.handleSelect, actions.loadMore, onGoBack])

  return {
    data: dataMemo,
    status: statusMemo,
    actions: actionsMemo,
  }
}
