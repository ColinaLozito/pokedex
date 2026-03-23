import type { CombinedPokemonDetail } from 'src/services/types'
import { GetThemeValueForKey } from 'tamagui'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor' | 'color'>

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

interface PokemonDetailsDataData {
  currentPokemon: CombinedPokemonDetail | undefined
  currentPokemonId: number | null
  bookmarkedPokemonIds: number[]
  isBookmarked: boolean
}

interface PokemonDetailsScreenData {
  currentPokemon: CombinedPokemonDetail | undefined
  isBookmarked: boolean
  primaryTypeColor: PrimaryTypeColor
}

type PokemonDetailsStatus = Pick<import('@/types/screen').ScreenStatus, 'loading' | 'error'>

export interface UsePokemonDetailsDataReturn {
  data: PokemonDetailsDataData
  status: PokemonDetailsStatus
  actions: {
    getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
    fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
    toggleBookmark: (id: number) => void
    clearError: () => void
  }
}

export interface UsePokemonDetailsScreenReturn {
  data: PokemonDetailsScreenData
  status: PokemonDetailsStatus
  actions: {
    handleEvolutionPress: (id: number) => Promise<void>
    handleBookmarkPress: () => void
    clearError: () => void
    getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  }
}

export type { PokemonTypeSlot, TypeChipsProps } from '../../components/pokemon/PokemonTypeChips/types'
export type { AbilityInfo } from './_parts/PokemonAbilities/types'
export type { AttributeRowProps, PokemonAttributesProps } from './_parts/PokemonAttributes/types'
export type { PokemonBaseStatsProps, StatInfo } from './_parts/PokemonBaseStats/types'

