import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { UsePokemonDetailsDataReturn } from '../types'

export function usePokemonDetailsData(): UsePokemonDetailsDataReturn {
  const storeData = usePokemonDataStore(
    useShallow(store => ({
      loading: store.loading,
      error: store.error,
      currentId: store.currentPokemonId,
      pokemon: store.currentPokemonId ? store.pokemonDetails[store.currentPokemonId] : undefined,
      getPokemonDetail: store.getPokemonDetail,
      fetchPokemonDetail: store.fetchPokemonDetail,
      clearError: store.clearError,
    }))
  )

  const { bookmarkedIds, toggleBookmark } = usePokemonGeneralStore(
    useShallow(store => ({
      bookmarkedIds: store.bookmarkedPokemonIds,
      toggleBookmark: store.toggleBookmark,
    }))
  )

  const isBookmarked = useMemo(
    () => storeData.currentId ? bookmarkedIds.includes(storeData.currentId) : false,
    [bookmarkedIds, storeData.currentId]
  )

  const data = useMemo(() => ({
    currentPokemon: storeData.pokemon,
    currentPokemonId: storeData.currentId,
    bookmarkedPokemonIds: bookmarkedIds,
    isBookmarked,
  }), [storeData.pokemon, storeData.currentId, bookmarkedIds, isBookmarked])

  const status = useMemo(() => ({
    loading: storeData.loading,
    error: storeData.error,
  }), [storeData.loading, storeData.error])

  const actions = useMemo(() => ({
    getPokemonDetail: storeData.getPokemonDetail,
    fetchPokemonDetail: storeData.fetchPokemonDetail,
    toggleBookmark,
    clearError: storeData.clearError,
  }), [
    storeData.getPokemonDetail,
    storeData.fetchPokemonDetail,
    toggleBookmark,
    storeData.clearError,
  ])

  return { data, status, actions }
}