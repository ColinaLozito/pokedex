import type { EvolutionChainLink } from 'src/services/types'
import type { CombinedPokemonDetail } from 'src/services/types'

export interface EvolutionChainProps {
  evolutionChainTree: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
  getPokemonDetail?: (id: number) => CombinedPokemonDetail | undefined
}
