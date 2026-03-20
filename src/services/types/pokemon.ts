import type { EvolutionChainLink, EvolutionPokemon } from './evolution'

export interface Sprites {
  readonly front_default: string | null
  readonly front_shiny: string | null
  readonly other?: {
    readonly 'official-artwork'?: {
      readonly front_default: string | null
    }
    readonly home?: {
      readonly front_default: string | null
    }
  }
}

export interface PokemonTypeSlot {
  readonly slot: number
  readonly type: {
    readonly name: string
    readonly url: string
  }
}

export interface PokemonStatEntry {
  readonly base_stat: number
  readonly stat: {
    readonly name: string
    readonly url: string
  }
}

export interface PokemonAbilityEntry {
  readonly ability: {
    readonly name: string
    readonly url: string
  }
  readonly is_hidden: boolean
}

export interface PokemonDetail {
  readonly id: number
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly sprites: Sprites
  readonly types: Array<PokemonTypeSlot>
  readonly stats: Array<PokemonStatEntry>
  readonly abilities: Array<PokemonAbilityEntry>
}

export interface PokemonResponse {
  readonly id: number
  readonly name: string
  readonly [key: string]: unknown
}

export interface PokemonListItem {
  readonly id: number
  readonly name: string
}

export interface SpeciesInfo {
  readonly genus: string
  readonly flavorText: string
  readonly habitat: string | null
  readonly isLegendary: boolean
  readonly isMythical: boolean
}

// EvolutionPokemon is defined in evolution.ts and reused here via import

export interface CombinedPokemonDetail {
  // From /pokemon/{id}
  readonly id: number
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly sprites: Sprites
  readonly types: Array<PokemonTypeSlot>
  readonly stats: Array<PokemonStatEntry>
  readonly abilities: Array<PokemonAbilityEntry>
  
  // From /pokemon-species/{id}
  readonly speciesInfo: SpeciesInfo
  
  // Evolution chain representations
  readonly evolutionChain: Array<EvolutionPokemon>
  readonly evolutionChainTree?: EvolutionChainLink
}
