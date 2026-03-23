import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useCallback, useMemo, useState } from 'react'
import type { PokemonListItem } from 'src/services/types'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import { useShallow } from 'zustand/react/shallow'
import { UseTypeFilterDataReturn } from '../types'

export function useTypeFilterData(
  typeId: number | null,
  typeName: string
): UseTypeFilterDataReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<PokemonDisplayDataArray>([])

  const { fetchPokemonByTypeAndGetDisplayData, getPokemonDisplayData } = usePokemonGeneralStore(
    useShallow(s => ({
      fetchPokemonByTypeAndGetDisplayData: s.fetchPokemonByTypeAndGetDisplayData,
      getPokemonDisplayData: s.getPokemonDisplayData,
    }))
  )

  const { fetchPokemonDetail, getPokemonDetail, pokemonDetails } = usePokemonDataStore(
    useShallow(s => ({
      fetchPokemonDetail: s.fetchPokemonDetail,
      getPokemonDetail: s.getPokemonDetail,
      pokemonDetails: s.pokemonDetails,
    }))
  )

  const addRecentSelection = usePokemonGeneralStore(s => s.addRecentSelection)

  const filteredData = useMemo(() => {
    if (rawData.length === 0) return rawData
    return getPokemonDisplayData(
      rawData.map(p => ({ id: p.id, name: p.name })),
      typeName
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, typeName, getPokemonDisplayData, pokemonDetails])

  const pokemonListForRecent = useMemo<PokemonListItem[]>(
    () => rawData.map(p => ({ id: p.id, name: p.name })),
    [rawData]
  )

  const { isLoading, handleSelect } = usePokemonSelection({
    pokemonList: pokemonListForRecent,
    fetchPokemonDetail,
    getPokemonDetail,
    addRecentSelection,
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
      const data = await fetchPokemonByTypeAndGetDisplayData(typeId, typeName)
      setRawData(data)
    } catch (_err) {
      setError('Failed to load Pokemon')
    } finally {
      setLoading(false)
    }
  }, [typeId, typeName, fetchPokemonByTypeAndGetDisplayData])

  return {
    filteredData,
    loading,
    isLoading,
    error,
    handleSelect,
    loadPokemon,
  }
}
