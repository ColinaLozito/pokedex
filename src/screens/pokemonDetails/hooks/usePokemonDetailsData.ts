import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'

export function usePokemonDetailsData() {
  const loading = usePokemonDataStore((state) => state.loading)
  const error = usePokemonDataStore((state) => state.error)
  const currentPokemonId = usePokemonDataStore(
    (state) => state.currentPokemonId
  )
  const currentPokemon = usePokemonDataStore((state) => {
    const id = state.currentPokemonId
    return id ? state.pokemonDetails[id] : undefined
  })
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const fetchPokemonDetail = usePokemonDataStore(
    (state) => state.fetchPokemonDetail
  )
  const clearError = usePokemonDataStore((state) => state.clearError)

  const bookmarkedPokemonIds = usePokemonGeneralStore(
    (state) => state.bookmarkedPokemonIds
  )
  const toggleBookmark = usePokemonGeneralStore(
    (state) => state.toggleBookmark
  )

  return {
    data: {
      currentPokemon,
      currentPokemonId,
      bookmarkedPokemonIds,
    },
    status: {
      loading,
      error,
    },
    actions: {
      getPokemonDetail,
      fetchPokemonDetail,
      toggleBookmark,
      clearError,
    },
  }
}
