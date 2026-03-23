/* eslint-disable react-hooks/exhaustive-deps */
import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useCallback, useMemo, useState } from 'react'
import type { PokemonListItem } from 'src/services/types'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import { useShallow } from 'zustand/react/shallow'
import type { UseTypeFilterDataReturn } from '../types'

export function useTypeFilterData(
  typeId: number | null,
  typeName: string
): UseTypeFilterDataReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<PokemonDisplayDataArray>([])

  const storeData = usePokemonGeneralStore(
    useShallow(store => ({
      fetchPokemonByTypeAndGetDisplayData: store.fetchPokemonByTypeAndGetDisplayData,
      getPokemonDisplayData: store.getPokemonDisplayData,
      addRecentSelection: store.addRecentSelection,
    }))
  )

  const pokemonStoreData = usePokemonDataStore(
    useShallow(store => ({
      fetchPokemonDetail: store.fetchPokemonDetail,
      getPokemonDetail: store.getPokemonDetail,
      pokemonDetails: store.pokemonDetails,
    }))
  )

  const filteredData = useMemo(() => {
    if (rawData.length === 0) return rawData
    return storeData.getPokemonDisplayData(
      rawData.map(pokemon => ({ id: pokemon.id, name: pokemon.name })),
      typeName
    )
   
  }, [rawData, typeName, storeData.getPokemonDisplayData, pokemonStoreData.pokemonDetails])

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

    try {
      setError(null)
      setLoading(true)
      const data = await storeData.fetchPokemonByTypeAndGetDisplayData(typeId, typeName)
      setRawData(data)
    } catch (_err) {
      setError('Failed to load Pokemon')
    } finally {
      setLoading(false)
    }
  }, [typeId, typeName, storeData.fetchPokemonByTypeAndGetDisplayData])

  const data = useMemo(() => ({
    filteredData,
    pokemonListForRecent,
  }), [filteredData, pokemonListForRecent])

  const status = useMemo(() => ({
    loading,
    isLoading,
    error,
  }), [loading, isLoading, error])

  const actions = useMemo(() => ({
    handleSelect,
    loadPokemon,
  }), [handleSelect, loadPokemon])

  return { data, status, actions }
}
