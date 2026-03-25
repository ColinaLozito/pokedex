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

export interface GQLPokemonByTypeVariables {
  typeName: string
  limit: number
  offset: number
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
