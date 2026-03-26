import { useQuery } from '@tanstack/react-query'
import graphqlRequest from 'graphql-request'
import { useMemo } from 'react'
import {
  EXCLUDED_TYPES,
  GET_POKEMON_TYPES,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonTypesResponse,
} from '../services/queries/pokemonQueries'

export interface TypeListItem {
  id: number
  name: string
}

export interface UsePokemonTypesReturn {
  data: TypeListItem[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

function transformData(data: GQLPokemonTypesResponse | undefined): TypeListItem[] {
  if (!data?.pokemon_v2_type) return []

  return data.pokemon_v2_type
    .filter((type) => !EXCLUDED_TYPES.includes(type.name))
    .map((type) => ({
      id: type.id,
      name: type.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function usePokemonTypesGQL(): UsePokemonTypesReturn {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pokemonTypes'],
    queryFn: async () => {
      const response = await graphqlRequest<GQLPokemonTypesResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        GET_POKEMON_TYPES
      )
      return response
    },
    staleTime: 1000 * 60 * 60,
  })

  const typeList = useMemo(() => transformData(data), [data])

  return {
    data: typeList,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  }
}
