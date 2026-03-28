import { gql } from 'graphql-request'

export const POKEAPI_GQL_V2_ENDPOINT = 'https://graphql.pokeapi.co/v1beta2'

export const GET_TYPE_LIST = gql`
  query GetTypeList {
    type {
      id
      name
    }
  }
`

export interface GQLType {
  id: number
  name: string
}

export interface GQLTypeListResponse {
  type: GQLType[]
}

export const EXCLUDED_TYPES = ['unknown', 'shadow', 'stellar']
