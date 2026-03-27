import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { ImageSourcePropType } from 'react-native'
import { getPokemonTypeStyles } from 'src/utils/pokemon/typeStyles'
import type { PokemonDisplayDataArray } from 'src/utils/pokemon/displayData'
import { usePokemonByTypeGQL } from '@/hooks/usePokemonByTypeGQL'
import type { PokemonListItem } from 'src/shared/types/pokemon.domain'
import { useUserStore } from '@/store/userStore'
import { usePokemonSelect } from '@/hooks/usePokemonSelect'
import { POKEMON_TYPES, type PokemonType } from '@theme/pokemonTypes'

const isValidPokemonType = (type: string): type is PokemonType => {
  return Object.values(POKEMON_TYPES).includes(type as PokemonType)
}

interface TypeFilterData {
  filteredData: PokemonDisplayDataArray
  pokemonListForRecent: PokemonListItem[]
  typeName: string
  typeColor: string
  typeIcon: ImageSourcePropType | undefined
  hasMore: boolean
}

interface TypeFilterStatus {
  loading: boolean
  isLoading: boolean
  isFetching: boolean
  error: string | null
  isCached: boolean
}

interface TypeFilterActions {
  handleSelect: (id: number) => Promise<void>
  onGoBack: () => void
  loadMore: () => void
}

export interface UseTypeFilterScreenReturn {
  data: TypeFilterData
  status: TypeFilterStatus
  actions: TypeFilterActions
}

export function useTypeFilterScreen(): UseTypeFilterScreenReturn {
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

  const { addRecentSelection } = useUserStore(
    useShallow((store) => ({
      addRecentSelection: store.addRecentSelection,
    }))
  )

  const { handleSelect } = usePokemonSelect({
    pokemonList: gqlData.map(p => ({ id: p.id, name: p.name })),
    addRecentSelection,
  })

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
