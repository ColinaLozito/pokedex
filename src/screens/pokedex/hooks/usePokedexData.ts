import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import type { UsePokedexDataReturn } from '../types'

export function usePokedexData(): UsePokedexDataReturn {
  const {
    pokemonList,
    addRecentSelection,
    bookmarkedPokemonIds,
    recentSelections,
    removeRecentSelection,
    typeList,
    toggleBookmark,
  } = usePokemonGeneralStore(
    useShallow(store => ({
      pokemonList: store.pokemonList,
      addRecentSelection: store.addRecentSelection,
      bookmarkedPokemonIds: store.bookmarkedPokemonIds,
      recentSelections: store.recentSelections,
      removeRecentSelection: store.removeRecentSelection,
      typeList: store.typeList,
      toggleBookmark: store.toggleBookmark,
    }))
  )

  const { fetchPokemonDetail, getPokemonDetail } = usePokemonDataStore(
    useShallow(s => ({
      fetchPokemonDetail: s.fetchPokemonDetail,
      getPokemonDetail: s.getPokemonDetail,
    }))
  )

  const pokemonListDataSet = useMemo(() =>
    pokemonList.map((pokemon) => ({
      id: pokemon.id.toString(),
      title: pokemon.name,
    })), [pokemonList]
  )

  const { isLoading, handleSelect } = usePokemonSelection({
    pokemonList,
    addRecentSelection,
    fetchPokemonDetail,
    getPokemonDetail,
    pokemonListDataSet,
  })

  return {
    pokemonListDataSet,
    bookmarkedPokemonIds,
    getPokemonDetail,
    toggleBookmark,
    recentSelections,
    removeRecentSelection,
    typeList,
    isLoading,
    handleSelect,
  }
}
