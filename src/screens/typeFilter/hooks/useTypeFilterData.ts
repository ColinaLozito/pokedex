/* eslint-disable react-hooks/exhaustive-deps */
import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useCallback, useMemo, useState } from 'react'
import type { PokemonListItem } from 'src/services/types'
import type { PokemonDisplayDataArray } from 'src/utils/pokemon/displayData'
import { useShallow } from 'zustand/react/shallow'
import type { UseTypeFilterDataReturn } from '../types'
import type { PokemonType } from '@theme/pokemonTypes'

const INITIAL_LOAD_COUNT = 10

export function useTypeFilterData(
  typeId: number | null,
  typeName: PokemonType
): UseTypeFilterDataReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<PokemonDisplayDataArray>([])
  const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD_COUNT)
  const [isCached, setIsCached] = useState(false)

  const storeData = usePokemonGeneralStore(
    useShallow(store => ({
      fetchPokemonByTypeAndGetDisplayData: store.fetchPokemonByTypeAndGetDisplayData,
      getPokemonDisplayData: store.getPokemonDisplayData,
      addRecentSelection: store.addRecentSelection,
      isTypeCached: store.isTypeCached,
      pokemonByType: store.pokemonByType,
    }))
  )

  const pokemonStoreData = usePokemonDataStore(
    useShallow(store => ({
      fetchPokemonDetail: store.fetchPokemonDetail,
      getPokemonDetail: store.getPokemonDetail,
      pokemonDetails: store.pokemonDetails,
    }))
  )

  const loadMore = useCallback(() => {
    setDisplayedCount(prev => Math.min(prev + INITIAL_LOAD_COUNT, rawData.length))
  }, [rawData.length])

  const filteredData = useMemo(() => {
    if (rawData.length === 0) return rawData
    const displayed = rawData.slice(0, displayedCount)
    return storeData.getPokemonDisplayData(
      displayed.map(pokemon => ({ id: pokemon.id, name: pokemon.name })),
      typeName
    )
  }, [rawData, displayedCount, typeName, storeData.getPokemonDisplayData, pokemonStoreData.pokemonDetails])

  const hasMore = useMemo(() => {
    return displayedCount < rawData.length
  }, [displayedCount, rawData.length])

  const pokemonListForRecent = useMemo<PokemonListItem[]>(
    () => rawData.map(pokemon => ({ id: pokemon.id, name: pokemon.name })),
    [rawData]
  )

  const { isLoading, handleSelect } = usePokemonSelection({
    pokemonList: pokemonListForRecent,
    fetchPokemonDetail: pokemonStoreData.fetchPokemonDetail,
    getPokemonDetail: pokemonStoreData.getPokemonDetail,
    addRecentSelection: storeData.addRecentSelection,
  })

  const loadPokemon = useCallback(async () => {
    if (!typeId) {
      setError('Invalid type ID')
      setLoading(false)
      return
    }

    const cached = storeData.isTypeCached(typeName)
    setIsCached(cached)
    
    if (cached) {
      const cachedList = storeData.pokemonByType[typeName]
      const data = storeData.getPokemonDisplayData(cachedList, typeName)
      setRawData(data)
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)
      setDisplayedCount(INITIAL_LOAD_COUNT)
      const data = await storeData.fetchPokemonByTypeAndGetDisplayData(typeId, typeName)
      setRawData(data)
      setIsCached(true)
    } catch (_err) {
      setError('Failed to load Pokemon')
    } finally {
      setLoading(false)
    }
  }, [typeId, typeName, storeData.fetchPokemonByTypeAndGetDisplayData, storeData.getPokemonDisplayData, storeData.pokemonByType, storeData.isTypeCached])

  const data = useMemo(() => ({
    filteredData,
    pokemonListForRecent,
    hasMore,
  }), [filteredData, pokemonListForRecent, hasMore])

  const status = useMemo(() => ({
    loading,
    isLoading,
    error,
    isCached,
  }), [loading, isLoading, error, isCached])

  const actions = useMemo(() => ({
    handleSelect,
    loadPokemon,
    loadMore,
  }), [handleSelect, loadPokemon, loadMore])

  return { data, status, actions }
}
