import { useQuery, keepPreviousData } from '@tanstack/react-query'
import graphqlRequest from 'graphql-request'
import { useCallback, useMemo, useState } from 'react'
import type { PokemonTypeSlot } from '@/shared/types/pokemon.domain'
import type { PokemonDisplayDataArray } from '@/utils/pokemon/displayData'
import { getPokemonSpriteUrl } from '@/utils/pokemon/sprites'
import {
  GET_POKEMON_BY_TYPE,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonByTypeResponse,
  type GQLPokemonByTypeVariables,
} from '@/shared/api/queries/pokemonQueries'

const INITIAL_LOAD_COUNT = 10

export interface UsePokemonByTypeGQLOptions {
  typeName: string
  enabled?: boolean
}

export interface UsePokemonByTypeGQLReturn {
  data: PokemonDisplayDataArray
  totalCount: number
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
}

function transformData(
  data: GQLPokemonByTypeResponse | undefined, 
  typeName: string
): PokemonDisplayDataArray {
  if (!data?.pokemon_v2_pokemon) return []
  
  return data.pokemon_v2_pokemon.map((pokemon) => {
    const types: PokemonTypeSlot[] = pokemon.pokemon_v2_pokemontypes.map(
      (pokemonType) => ({
        slot: pokemonType.slot,
        type: {
          name: pokemonType.pokemon_v2_type.name,
        },
      })
    )

    const primaryType =
      types.find((t) => t.slot === 1)?.type.name ||
      types[0]?.type.name ||
      typeName

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite: getPokemonSpriteUrl(pokemon.id),
      primaryType,
      types,
    }
  })
}

export function usePokemonByTypeGQL({
  typeName,
  enabled = true,
}: UsePokemonByTypeGQLOptions): UsePokemonByTypeGQLReturn {
  const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD_COUNT)

  const variables = useMemo<GQLPokemonByTypeVariables>(
    () => ({
      typeName,
      limit: displayedCount,
      offset: 0,
    }),
    [typeName, displayedCount]
  )

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['pokemonByType', typeName, displayedCount],
    queryFn: async () => {
      const response = await graphqlRequest<GQLPokemonByTypeResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        GET_POKEMON_BY_TYPE,
        variables
      )
      return response
    },
    enabled: enabled && !!typeName,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })

  const pokemonList = useMemo(() => {
    return transformData(data, typeName)
  }, [data, typeName])

  const totalCount = useMemo(() => {
    return data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0
  }, [data])

  const hasMore = useMemo(() => {
    return pokemonList.length < totalCount
  }, [pokemonList.length, totalCount])

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => prev + INITIAL_LOAD_COUNT)
  }, [])

  return {
    data: pokemonList,
    totalCount,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    hasMore,
    loadMore,
    refetch,
  }
}
