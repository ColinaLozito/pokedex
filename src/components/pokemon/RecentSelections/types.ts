import type { CombinedPokemonDetail } from 'src/services/types'
import type { RecentSelection } from 'src/store/pokemonGeneralStore'

export interface RecentSelectionsProps {
  recentSelections: RecentSelection[]
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
}
