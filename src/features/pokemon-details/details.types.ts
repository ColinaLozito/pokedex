import type { CombinedPokemonDetail, EvolutionChainLink } from 'src/shared/types/pokemon.domain'
import type { ScreenStatus } from '@/types/screen'

type PrimaryTypeColor = string

type PokemonDetailsStatus = Pick<ScreenStatus, 'loading' | 'error'>

interface PokemonDetailsData {
  currentPokemon: CombinedPokemonDetail | undefined
  isBookmarked: boolean
  primaryTypeColor: PrimaryTypeColor
}

interface PokemonDetailsActions {
  clearError: () => void
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  handleEvolutionPress: (id: number) => Promise<void>
  handleBookmarkPress: () => void
}

export interface UsePokemonDetailsReturn {
  data: PokemonDetailsData
  status: PokemonDetailsStatus
  actions: PokemonDetailsActions
}

export interface EvolutionChainProps {
  evolutionChainTree?: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
}

export interface EvolutionSpriteContainerProps {
  sprite: string
  name: string
  id: number
  isCurrent?: boolean
  onPress?: () => void
  variant?: string
}

export interface PokemonAbilitiesProps {
  abilities: CombinedPokemonDetail['abilities']
}

export interface AttributeRowProps {
  label: string
  value: string | number
}

export interface PokemonAttributesProps {
  species?: string
  height: number
  weight: number
}

export interface PokemonBaseStatsProps {
  stats: CombinedPokemonDetail['stats']
  primaryTypeColor?: string
}

export interface PokemonDetailsContentProps {
  pokemon: CombinedPokemonDetail
  primaryTypeColor: string
  onEvolutionPress: (id: number) => void
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
}

export interface PokemonDetailsEmptyStateProps {
  title?: string
  subtitle?: string
}

export interface PokemonDetailsHeaderProps {
  pokemon: CombinedPokemonDetail
  isBookmarked: boolean
  onBookmarkPress: () => void
  primaryTypeColor: string
}
