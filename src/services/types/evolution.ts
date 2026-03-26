export interface EvolutionChainLink {
  readonly species: {
    readonly name: string
    readonly url: string
  }
  readonly evolves_to: Array<EvolutionChainLink>
}

export interface EvolutionChain {
  readonly id: number
  readonly chain: EvolutionChainLink
}

export interface EvolutionPokemon {
  readonly id: number
  readonly name: string
}
