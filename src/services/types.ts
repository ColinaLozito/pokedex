export interface PokemonResponse {
  id: number
  name: string
  [key: string]: unknown
}

export interface PokemonListItem {
  id: number
  name: string
}

export interface TypeListItem {
  id: number
  name: string
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
      home?: {
        front_default: string | null
      }
    }
  }
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
      url: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
}

export interface PokemonSpecies {
  id: number
  name: string
  evolution_chain: {
    url: string
  }
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version: {
      name: string
      url: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
      url: string
    }
  }>
  habitat: {
    name: string
    url: string
  } | null
  is_legendary: boolean
  is_mythical: boolean
}

export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionPokemon {
  id: number
  name: string
  // Note: sprite will be retrieved from store when rendering
}

export interface CombinedPokemonDetail {
  // From /pokemon/{id}
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonDetail['sprites']
  types: PokemonDetail['types']
  stats: PokemonDetail['stats']
  abilities: PokemonDetail['abilities']
  
  // From /pokemon-species/{id}
  speciesInfo: {
    genus: string
    flavorText: string
    habitat: string | null
    isLegendary: boolean
    isMythical: boolean
  }
  
  // Evolution chain (flat array for backward compatibility)
  evolutionChain: EvolutionPokemon[]
  
  // Full evolution chain tree structure
  evolutionChainTree?: EvolutionChainLink
}

export interface TypeResponse {
  id: number
  name: string
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }>
}

