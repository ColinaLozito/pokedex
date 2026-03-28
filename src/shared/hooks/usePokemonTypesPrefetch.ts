import graphqlRequest from 'graphql-request'
import { getQueryClient } from '@/providers/MainProvidersWrapper'
import {
  GET_POKEMON_TYPES,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonTypesResponse,
} from '@/shared/api/queries/pokemonQueries'

export async function prefetchPokemonTypes(): Promise<void> {
  const client = getQueryClient()
  await client.prefetchQuery({
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
}
