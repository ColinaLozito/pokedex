import type { EvolutionChainLink } from 'src/services/types'
import type { CombinedPokemonDetail } from 'src/services/types'
import type { EvolutionNode } from 'src/utils/evolutionTree'

export interface EvolutionChainProps {
  evolutionChainTree: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
  getPokemonDetail?: (id: number) => CombinedPokemonDetail | undefined
}

export type EvolutionLinearChainProps = Omit<EvolutionChainProps, 'evolutionChainTree'> & {
  nodes: EvolutionNode[]
}

export type EvolutionBranchingChainProps = Omit<EvolutionChainProps, 'evolutionChainTree'> & {
  rootNode: EvolutionNode
}
