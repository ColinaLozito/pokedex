import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import { getPokemonTypeStyles } from 'src/utils/pokemonThemeUtils'
import type { UseTypeFilterScreenReturn } from '../types'
import { useTypeFilterData } from './useTypeFilterData'

export function useTypeFilterScreen(): UseTypeFilterScreenReturn {
  const router = useRouter()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()

  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeName = params.typeName || 'Unknown'

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
  }), [data.filteredData, data.pokemonListForRecent, typeName, typeColor, typeIcon])

  const statusMemo = useMemo(() => ({
    loading: status.loading,
    isLoading: status.isLoading,
    error: status.error,
  }), [status.loading, status.isLoading, status.error])

  const actionsMemo = useMemo(() => ({
    handleSelect: actions.handleSelect,
    onGoBack,
  }), [actions.handleSelect, onGoBack])

  return {
    data: dataMemo,
    status: statusMemo,
    actions: actionsMemo,
  }
}
