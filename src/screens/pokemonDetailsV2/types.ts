import type { CombinedPokemonDetail } from 'src/services/types/pokemon'
import type { ScreenStatus } from '@/types/screen'
import { GetThemeValueForKey } from 'tamagui'

type PrimaryTypeColor = string | GetThemeValueForKey<'backgroundColor' | 'color'>

type PokemonDetailsStatus = Pick<ScreenStatus, 'loading' | 'error'>

interface PokemonDetailsV2Data {
  currentPokemon: CombinedPokemonDetail | undefined
  isBookmarked: boolean
  primaryTypeColor: PrimaryTypeColor
}

interface PokemonDetailsV2Actions {
  clearError: () => void
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  handleEvolutionPress: (id: number) => Promise<void>
  handleBookmarkPress: () => void
}

export interface UsePokemonDetailsV2Return {
  data: PokemonDetailsV2Data
  status: PokemonDetailsStatus
  actions: PokemonDetailsV2Actions
}
