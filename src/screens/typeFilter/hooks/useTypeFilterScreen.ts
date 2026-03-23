import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { getPokemonTypeStyles } from 'src/utils/pokemonThemeUtils'
import { UseTypeFilterScreenReturn } from '../types'
import { useTypeFilterData } from './useTypeFilterData'

export function useTypeFilterScreen(): UseTypeFilterScreenReturn {
  const router = useRouter()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()

  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeName = params.typeName || 'Unknown'

  const { 
    filteredData, 
    loading, 
    isLoading, 
    error, 
    handleSelect, 
    loadPokemon 
  } = useTypeFilterData(
    typeId,
    typeName
  )

  const { typeColor, typeIcon } = getPokemonTypeStyles(typeName)

  const onGoBack = () => router.back()

  useEffect(() => {
    loadPokemon()
  }, [loadPokemon])

  return {
    filteredData,
    loading,
    isLoading,
    error,
    typeName,
    typeColor,
    typeIcon,
    handleSelect,
    onGoBack,
  }
}
