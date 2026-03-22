import typeSymbolsIcons from 'src/utils/typeSymbolsIcons'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'
import type { PokemonListItem } from 'src/services/types'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { pokemonTypeColors } from '@theme/colors'
import { useEffect, useState } from 'react'

export function useTypeFilterData(typeId: number | null, typeName: string) {
  const [filteredData, setFilteredData] = useState<PokemonDisplayDataArray>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemonByTypeAndGetDisplayData = usePokemonGeneralStore(
    (state) => state.fetchPokemonByTypeAndGetDisplayData
  )
  const getPokemonDisplayData = usePokemonGeneralStore(
    (state) => state.getPokemonDisplayData
  )

  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const pokemonDetails = usePokemonDataStore((state) => state.pokemonDetails)
  const addRecentSelection = usePokemonGeneralStore((state) => state.addRecentSelection)

  const pokemonListForRecent: PokemonListItem[] = filteredData.map(p => ({ id: p.id, name: p.name }))

  const { isLoading, handleSelect } = usePokemonSelection({
    pokemonList: pokemonListForRecent,
    fetchPokemonDetail,
    getPokemonDetail,
    addRecentSelection,
  })

  const loadPokemon = async () => {
    if (!typeId) {
      setError('Invalid type ID')
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)
      const data = await fetchPokemonByTypeAndGetDisplayData(typeId, typeName)
      setFilteredData(data)
    } catch (_err) {
      setError('Failed to load Pokemon')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPokemon()
  }, [typeId, typeName, fetchPokemonByTypeAndGetDisplayData])

  useEffect(() => {
    if (filteredData.length === 0) return

    const updatedData = getPokemonDisplayData(
      filteredData.map(p => ({ id: p.id, name: p.name })),
      typeName
    )
    setFilteredData(updatedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonDetails])

  const typeColor = pokemonTypeColors[typeName.toLowerCase() as keyof typeof pokemonTypeColors] || '$hillary'
  const typeIcon = typeSymbolsIcons[typeName.toLowerCase() as keyof typeof typeSymbolsIcons]

  return {
    filteredData,
    loading,
    isLoading,
    error,
    typeName,
    typeColor,
    typeIcon,
    handleSelect,
  }
}
