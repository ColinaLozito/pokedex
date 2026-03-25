import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { ImageSourcePropType } from 'react-native'
import { getPokemonTypeStyles } from 'src/utils/pokemon/typeStyles'
import type { PokemonDisplayDataArray } from 'src/utils/pokemon/displayData'
import { usePokemonByTypeGQL } from '@/hooks/usePokemonByTypeGQL'
import type { PokemonListItem } from 'src/services/types'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { POKEMON_TYPES, type PokemonType } from '@theme/pokemonTypes'
import { useShallow } from 'zustand/react/shallow'

const isValidPokemonType = (type: string): type is PokemonType => {
  return Object.values(POKEMON_TYPES).includes(type as PokemonType)
}

interface TypeFilterV2Data {
  filteredData: PokemonDisplayDataArray
  pokemonListForRecent: PokemonListItem[]
  typeName: string
  typeColor: string
  typeIcon: ImageSourcePropType | undefined
  hasMore: boolean
}

interface TypeFilterV2Status {
  loading: boolean
  isLoading: boolean
  isFetching: boolean
  error: string | null
  isCached: boolean
}

interface TypeFilterV2Actions {
  handleSelect: (id: number) => Promise<void>
  onGoBack: () => void
  loadMore: () => void
}

export interface UseTypeFilterV2ScreenReturn {
  data: TypeFilterV2Data
  status: TypeFilterV2Status
  actions: TypeFilterV2Actions
}

export function useTypeFilterV2Screen(): UseTypeFilterV2ScreenReturn {
  const router = useRouter()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()

  const typeNameRaw = params.typeName || 'normal'
  const typeName = isValidPokemonType(typeNameRaw) ? typeNameRaw : 'normal'

  const { 
    data: gqlData, 
    isLoading, 
    isFetching, 
    isError,
    error, 
    hasMore, 
    loadMore 
  } = usePokemonByTypeGQL({
    typeName,
    enabled: !!typeName,
  })

  const typeStyles = getPokemonTypeStyles(typeName)
  const typeColor = typeStyles.typeColor as string
  const typeIcon = typeStyles.typeIcon

  const pokemonStoreData = usePokemonDataStore(
    useShallow(store => ({
      fetchPokemonDetail: store.fetchPokemonDetail,
      getPokemonDetail: store.getPokemonDetail,
    }))
  )

  const storeActions = usePokemonGeneralStore(
    useShallow(store => ({
      addRecentSelection: store.addRecentSelection,
    }))
  )

  const handleSelect = useCallback(async (id: number) => {
    const pokemonDetail = pokemonStoreData.getPokemonDetail(id)
    if (!pokemonDetail) {
      await pokemonStoreData.fetchPokemonDetail(id)
    }
    storeActions.addRecentSelection({ id, name: gqlData.find(p => p.id === id)?.name || '' })
    router.push({
      pathname: '/pokemonDetails',
      params: { id: id.toString() },
    })
  }, [router, pokemonStoreData, storeActions, gqlData])

  const onGoBack = useCallback(() => router.back(), [router])

  const dataMemo = useMemo(() => ({
    filteredData: gqlData,
    pokemonListForRecent: gqlData.map(p => ({ id: p.id, name: p.name })),
    typeName,
    typeColor,
    typeIcon,
    hasMore,
  }), [gqlData, typeName, typeColor, typeIcon, hasMore])

  const statusMemo = useMemo(() => ({
    loading: isLoading,
    isLoading,
    isFetching,
    error: isError ? (error?.message || 'Failed to load Pokemon') : null,
    isCached: false,
  }), [isLoading, isFetching, isError, error])

  const actionsMemo = useMemo(() => ({
    handleSelect,
    onGoBack,
    loadMore,
  }), [handleSelect, onGoBack, loadMore])

  return {
    data: dataMemo,
    status: statusMemo,
    actions: actionsMemo,
  }
}
