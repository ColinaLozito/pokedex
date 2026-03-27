/**
 * Pokemon Domain Types - Single Source of Truth
 * 
 * This file contains the Master Entity and all derived types.
 * Use Pick<T, K> and Omit<T, K> to create smaller types as needed.
 */

// Evolution types defined inline (moved from src/services/types/evolution.ts)
export interface EvolutionChainLink {
  readonly species: {
    readonly name: string
    readonly url: string
  }
  readonly evolves_to: Array<EvolutionChainLink>
}

export interface EvolutionPokemon {
  readonly id: number
  readonly name: string
}

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

export interface SpeciesInfo {
  readonly genus: string
  readonly flavorText: string
  readonly habitat: string | null
  readonly isLegendary: boolean
  readonly isMythical: boolean
}

export interface PokemonTypeSlot {
  readonly slot: number
  readonly type: {
    readonly name: string
    readonly url?: string
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

export interface PokemonListItem {
  readonly id: number
  readonly name: string
}

export interface CombinedPokemonDetail {
  readonly id: number
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly sprites: Sprites
  readonly types: Array<PokemonTypeSlot>
  readonly stats: Array<PokemonStatEntry>
  readonly abilities: Array<PokemonAbilityEntry>
  readonly speciesInfo: SpeciesInfo
  readonly evolutionChain: Array<EvolutionPokemon>
  readonly evolutionChainTree?: EvolutionChainLink
}

export type PokemonPreview = Pick<CombinedPokemonDetail, 'id' | 'name'>

export type PokemonListWithTypes = Pick<CombinedPokemonDetail, 'id' | 'name' | 'types'>

export type PokemonCardDisplay = Pick<CombinedPokemonDetail, 'id' | 'name' | 'sprites' | 'types'>

export type PokemonSearchItem = Pick<CombinedPokemonDetail, 'id' | 'name' | 'sprites'>

export type PokemonGridItem = Omit<CombinedPokemonDetail, 'stats' | 'abilities' | 'speciesInfo' | 'evolutionChain' | 'evolutionChainTree'>

export type PokemonEvolutionItem = Pick<EvolutionPokemon, 'id' | 'name'>

export type PokemonAbilitiesOnly = Pick<CombinedPokemonDetail, 'abilities'>

export type PokemonStatsOnly = Pick<CombinedPokemonDetail, 'stats'>

export type PokemonTypesOnly = Pick<CombinedPokemonDetail, 'types'>

export type PartialPokemonDetail = Partial<CombinedPokemonDetail>

export type RequiredPokemonDetail = Required<PokemonPreview>
