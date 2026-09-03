import { useQuery } from '@tanstack/react-query'
import graphqlRequest from 'graphql-request'
import { useMemo } from 'react'
import {
  GET_POKEMON_NAMES,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonNamesResponse,
} from '@/shared/api/queries/pokemonQueries'

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

interface UseRoundNamesReturn {
  names: string[] | null
  isLoading: boolean
  errorMessage: string | null
}

export function useRoundNames(ids: number[] | null): UseRoundNamesReturn {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['whosThatPokemonNames', ids],
    queryFn: async () => {
      if (!ids) throw new Error('No round IDs')
      return graphqlRequest<GQLPokemonNamesResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        GET_POKEMON_NAMES,
        { ids },
      )
    },
    enabled: ids !== null,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })

  const names = useMemo(() => {
    if (!data?.pokemon_v2_pokemon || !ids) return null
    const nameMap: Record<number, string> = {}
    data.pokemon_v2_pokemon.forEach((p) => {
      nameMap[p.id] = capitalize(p.name)
    })
    return ids.map((id) => nameMap[id] || '???')
  }, [data, ids])

  return {
    names,
    isLoading,
    errorMessage: isError ? (error?.message ?? 'Failed to load Pokémon') : null,
  }
}
