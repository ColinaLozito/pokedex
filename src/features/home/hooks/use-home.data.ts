import { usePokemonSelection } from '@/shared/hooks/usePokemonSelection'
import { usePokemonSearchGQL } from './use-pokemon-search.hook'
import { usePokemonTypesGQL } from './use-pokemon-types.hook'
import { useGetCachedPokemonDetail } from '@/shared/hooks/useGetCachedPokemonDetail'
import { useUserStore } from '@/store/userStore'
import { useMemo, useState, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { UseHomeDataReturn } from '../home.types'

export function useHomeData(): UseHomeDataReturn {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: typeList } = usePokemonTypesGQL()
  const getPokemonDetail = useGetCachedPokemonDetail()

  const userStoreData = useUserStore(
    useShallow((store) => ({
      bookmarkedPokemonIds: store.bookmarkedPokemonIds,
      recentSelections: store.recentSelections,
      removeRecentSelection: store.removeRecentSelection,
      addRecentSelection: store.addRecentSelection,
      toggleBookmark: store.toggleBookmark,
    }))
  )

  const { suggestions, isLoading: isSearchLoading } = usePokemonSearchGQL({ searchTerm })

  const pokemonListDataSet = useMemo(() =>
    suggestions.map((pokemon) => ({
      id: pokemon.id,
      title: pokemon.title,
    })), [suggestions]
  )

  const { handleSelect } = usePokemonSelection({
    pokemonList: suggestions.map(p => ({ id: parseInt(p.id, 10), name: p.title })),
    addRecentSelection: userStoreData.addRecentSelection,
    pokemonListDataSet,
  })

  const onSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const data = useMemo(() => ({
    pokemonListDataSet,
    bookmarkedPokemonIds: userStoreData.bookmarkedPokemonIds,
    recentSelections: userStoreData.recentSelections,
    typeList: typeList || [],
    searchResults: suggestions,
    isSearchLoading: isSearchLoading,
  }), [
    pokemonListDataSet,
    userStoreData,
    typeList,
    suggestions,
    isSearchLoading,
  ])

  const actions = useMemo(() => ({
    getPokemonDetail,
    toggleBookmark: userStoreData.toggleBookmark,
    removeRecentSelection: userStoreData.removeRecentSelection,
    handleSelect,
    onSearchChange,
  }), [
    getPokemonDetail,
    userStoreData.toggleBookmark,
    userStoreData.removeRecentSelection,
    handleSelect,
    onSearchChange,
  ])

  return { data, actions }
}
