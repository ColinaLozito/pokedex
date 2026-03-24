import type { CombinedPokemonDetail, PokemonAbilityEntry, PokemonStatEntry } from 'src/services/types/pokemon'
import type { EvolutionChainLink } from 'src/services/types/evolution'
import type { ScreenStatus } from '@/types/screen'
import { GetThemeValueForKey } from 'tamagui'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor' | 'color'>

type PokemonDetailsStatus = Pick<ScreenStatus, 'loading' | 'error'>

interface PokemonDetailsBaseProps {
  pokemon: CombinedPokemonDetail
  primaryTypeColor: PrimaryTypeColor
}

export interface PokemonDetailsHeaderProps extends PokemonDetailsBaseProps {
  isBookmarked: boolean
  onBookmarkPress: () => void
}

export interface PokemonDetailsContentProps extends PokemonDetailsBaseProps {
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

interface PokemonDetailsActionsBase {
  clearError: () => void
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
}

interface UsePokemonDetailsDataActions extends PokemonDetailsActionsBase {
  fetchPokemonDetail: (id: number) => Promise<CombinedPokemonDetail>
  toggleBookmark: (id: number) => void
}

interface UsePokemonDetailsScreenActions extends PokemonDetailsActionsBase {
  handleEvolutionPress: (id: number) => Promise<void>
  handleBookmarkPress: () => void
}

export interface UsePokemonDetailsDataReturn {
  data: PokemonDetailsDataData
  status: PokemonDetailsStatus
  actions: UsePokemonDetailsDataActions
}

export interface UsePokemonDetailsScreenReturn {
  data: PokemonDetailsScreenData
  status: PokemonDetailsStatus
  actions: UsePokemonDetailsScreenActions
}

export interface EvolutionChainProps {
  evolutionChainTree: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
  getPokemonDetail?: (id: number) => CombinedPokemonDetail | undefined
}

export type EvolutionSpriteContainerProps = {
  sprite: string
  name: string
  id: number
  isCurrent: boolean
  onPress: () => void
  variant?: 'linear' | 'branching-initial' | 'branching-variant'
}

export type PokemonAbilitiesProps = {
  abilities: PokemonAbilityEntry[]
}

export interface PokemonAttributesProps {
  species?: string
  height?: number
  weight?: number
}

export interface AttributeRowProps {
  label: string
  value: string | number
}

export interface PokemonBaseStatsProps {
  stats: PokemonStatEntry[]
  primaryTypeColor: string | GetThemeValueForKey<'backgroundColor'>
}
