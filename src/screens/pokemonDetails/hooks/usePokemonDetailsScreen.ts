import { baseColors } from '@theme/colors'
import { getPokemonTypeStyles } from 'src/utils/pokemonThemeUtils'
import { usePokemonDetailsData } from './usePokemonDetailsData'

export function usePokemonDetailsScreen() {
  const { data, status, actions } = usePokemonDetailsData()

  const isBookmarked = data.currentPokemon
    ? data.bookmarkedPokemonIds.includes(data.currentPokemon.id)
    : false

  const primaryType = data.currentPokemon?.types?.[0]?.type?.name
  const { typeColor: themeColor } = primaryType
    ? getPokemonTypeStyles(primaryType)
    : { typeColor: baseColors.white }

  const handleBookmarkPress = () => {
    if (data.currentPokemon) {
      actions.toggleBookmark(data.currentPokemon.id)
    }
  }

  const handleEvolutionPress = async (pokemonId: number) => {
    if (pokemonId === data.currentPokemonId) {
      return
    }
    try {
      await actions.fetchPokemonDetail(pokemonId)
    } catch {
      // Error toast handled by store
    }
  }

  return {
    pokemon: {
      currentPokemon: data.currentPokemon,
      isBookmarked,
    },
    theme: {
      primaryTypeColor: themeColor,
    },
    status: {
      loading: status.loading,
      error: status.error,
    },
    handlers: {
      handleEvolutionPress,
      handleBookmarkPress,
    },
    actions: {
      clearError: actions.clearError,
      getPokemonDetail: actions.getPokemonDetail,
    },
  }
}
