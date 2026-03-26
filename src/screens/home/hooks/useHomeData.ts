import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { usePokemonSearchGQL } from '@/hooks/usePokemonSearchGQL'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useMemo, useState, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { UseHomeDataReturn } from '../types'

export function useHomeData(): UseHomeDataReturn {
  const [searchTerm, setSearchTerm] = useState('')

  const storeData = usePokemonGeneralStore(
    useShallow(store => ({
      pokemonList: store.pokemonList,
      bookmarkedPokemonIds: store.bookmarkedPokemonIds,
      recentSelections: store.recentSelections,
      removeRecentSelection: store.removeRecentSelection,
      typeList: store.typeList,
      addRecentSelection: store.addRecentSelection,
      toggleBookmark: store.toggleBookmark,
    }))
  )

  const pokemonStoreData = usePokemonDataStore(
    useShallow(store => ({
      fetchPokemonDetail: store.fetchPokemonDetail,
      getPokemonDetail: store.getPokemonDetail,
    }))
  )

  const { suggestions, isLoading } = usePokemonSearchGQL({ searchTerm })

  const pokemonListDataSet = useMemo(() =>
    storeData.pokemonList.map((pokemon) => ({
      id: pokemon.id.toString(),
      title: pokemon.name,
    })), [storeData.pokemonList]
  )

  const { handleSelect } = usePokemonSelection({
    pokemonList: storeData.pokemonList,
    addRecentSelection: storeData.addRecentSelection,
    fetchPokemonDetail: pokemonStoreData.fetchPokemonDetail,
    getPokemonDetail: pokemonStoreData.getPokemonDetail,
    pokemonListDataSet,
  })

  const onSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const data = useMemo(() => ({
    pokemonListDataSet,
    bookmarkedPokemonIds: storeData.bookmarkedPokemonIds,
    recentSelections: storeData.recentSelections,
    typeList: storeData.typeList,
    searchResults: suggestions,
    isSearchLoading: isLoading,
  }), [
    pokemonListDataSet,
    storeData.bookmarkedPokemonIds,
    storeData.recentSelections,
    storeData.typeList,
    suggestions,
    isLoading,
  ])

  const actions = useMemo(() => ({
    getPokemonDetail: pokemonStoreData.getPokemonDetail,
    toggleBookmark: storeData.toggleBookmark,
    removeRecentSelection: storeData.removeRecentSelection,
    handleSelect,
    onSearchChange,
  }), [
    pokemonStoreData.getPokemonDetail,
    storeData.toggleBookmark,
    storeData.removeRecentSelection,
    handleSelect,
    onSearchChange,
  ])

  return { data, actions }
}