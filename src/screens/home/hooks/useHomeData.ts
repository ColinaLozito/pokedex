import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { UseHomeDataReturn } from '../types'

export function useHomeData(): UseHomeDataReturn {
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

  const data = useMemo(() => ({
    pokemonListDataSet,
    bookmarkedPokemonIds: storeData.bookmarkedPokemonIds,
    recentSelections: storeData.recentSelections,
    typeList: storeData.typeList,
  }), [
    pokemonListDataSet,
    storeData.bookmarkedPokemonIds,
    storeData.recentSelections,
    storeData.typeList,
  ])

  const actions = useMemo(() => ({
    getPokemonDetail: pokemonStoreData.getPokemonDetail,
    toggleBookmark: storeData.toggleBookmark,
    removeRecentSelection: storeData.removeRecentSelection,
    handleSelect,
  }), [
    pokemonStoreData.getPokemonDetail,
    storeData.toggleBookmark,
    storeData.removeRecentSelection,
    handleSelect,
  ])

  return { data, actions }
}
