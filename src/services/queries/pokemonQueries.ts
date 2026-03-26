import { gql } from 'graphql-request'

export const POKEAPI_GQL_V2_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta'

export const GET_POKEMON_BY_TYPE = gql`
  query GetPokemonByType($typeName: String!, $limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(where: { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $typeName } } } }, limit: $limit, offset: $offset) {
      id
      name
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type {
          name
        }
      }
    }
    pokemon_v2_pokemon_aggregate(where: { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $typeName } } } }) {
      aggregate {
        count
      }
    }
  }
`

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonabilities {
        is_hidden
        pokemon_v2_ability {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`

export const SEARCH_POKEMON = gql`
  query SearchPokemon($searchTerm: String!) {
    pokemon_v2_pokemon(
      where: { name: { _ilike: $searchTerm } }
      limit: 15
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`

export const STAT_ORDER = [
  'hp', 
  'attack', 
  'defense', 
  'special-attack', 
  'special-defense', 
  'speed'
] as const

export type StatName = typeof STAT_ORDER[number]

export interface GQLPokemonByTypeVariables {
  typeName: string
  limit: number
  offset: number
}

export interface GQLPokemonDetailsVariables {
  id: number
}

export interface GQLType {
  name: string
}

export interface GQLPokemonType {
  slot: number
  pokemon_v2_type: GQLType
}

export interface GQLPokemon {
  id: number
  name: string
  pokemon_v2_pokemontypes: GQLPokemonType[]
}

export interface GQLPokemonByTypeResponse {
  pokemon_v2_pokemon: GQLPokemon[]
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number
    }
  }
}

export interface GQLStat {
  base_stat: number
  pokemon_v2_stat: {
    name: string
  }
}

export interface GQLAbility {
  is_hidden: boolean
  pokemon_v2_ability: {
    name: string
  }
}

export interface GQLSprite {
  sprites: string
}

export interface GQLPokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  pokemon_v2_pokemontypes: GQLPokemonType[]
  pokemon_v2_pokemonstats: GQLStat[]
  pokemon_v2_pokemonabilities: GQLAbility[]
  pokemon_v2_pokemonsprites: GQLSprite[]
}

export interface GQLPokemonDetailsResponse {
  pokemon_v2_pokemon: GQLPokemonDetail[]
}

export interface GQLSearchPokemonVariables {
  searchTerm: string
}

export interface GQLSearchResult {
  id: number
  name: string
  pokemon_v2_pokemonsprites: GQLSprite[]
}

export interface GQLSearchPokemonResponse {
  pokemon_v2_pokemon: GQLSearchResult[]
}
