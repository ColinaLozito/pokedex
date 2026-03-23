import type { CombinedPokemonDetail } from 'src/services/types'
import { GetThemeValueForKey } from 'tamagui'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor'>

export interface PokemonDetailsHeaderProps {
  pokemon: CombinedPokemonDetail
  isBookmarked: boolean
  onBookmarkPress: () => void
  primaryTypeColor: PrimaryTypeColor
}

export interface PokemonDetailsContentProps {
  pokemon: CombinedPokemonDetail
  primaryTypeColor: PrimaryTypeColor
  onEvolutionPress: (id: number) => Promise<void>
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
}

export interface PokemonDetailsEmptyStateProps {
  title?: string
  subtitle?: string
}

export interface UsePokemonDetailsDataReturn {
  data: {
    currentPokemon: CombinedPokemonDetail | undefined
    currentPokemonId: number | null
    bookmarkedPokemonIds: number[]
    isBookmarked: boolean
  }
  status: {
    loading: boolean
    error: string | null
  }
  actions: {
    getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
    fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
    toggleBookmark: (id: number) => void
    clearError: () => void
  }
}

export interface UsePokemonDetailsScreenReturn {
  data: {
    currentPokemon: CombinedPokemonDetail | undefined
    isBookmarked: boolean
    primaryTypeColor: string | GetThemeValueForKey<'backgroundColor'>
  }
  status: {
    loading: boolean
    error: string | null
  }
  actions: {
    handleEvolutionPress: (id: number) => Promise<void>
    handleBookmarkPress: () => void
    clearError: () => void
    getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  }
}
