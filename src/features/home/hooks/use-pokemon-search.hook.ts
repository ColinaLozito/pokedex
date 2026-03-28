import { useQuery, keepPreviousData } from '@tanstack/react-query'
import graphqlRequest from 'graphql-request'
import { useEffect, useMemo, useState } from 'react'
import {
  SEARCH_POKEMON,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLSearchPokemonResponse,
  type GQLSearchPokemonVariables,
} from '@/shared/api/queries/pokemonQueries'

export interface SearchSuggestion {
  id: string
  title: string
}

export interface UsePokemonSearchGQLOptions {
  searchTerm: string
}

export interface UsePokemonSearchGQLReturn {
  suggestions: SearchSuggestion[]
  isLoading: boolean
  isError: boolean
  hasResults: boolean
}

const DEBOUNCE_MS = 300

export function usePokemonSearchGQL(
  { searchTerm }: UsePokemonSearchGQLOptions
): UsePokemonSearchGQLReturn {
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const hasValidSearchTerm = searchTerm.length > 2
  const effectiveSearchTerm = hasValidSearchTerm ? debouncedTerm : ''

  useEffect(() => {
    if (!hasValidSearchTerm) {
      return
    }

    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchTerm, hasValidSearchTerm])

  const { data, isError, isFetching } = useQuery({
    queryKey: ['searchPokemon', effectiveSearchTerm],
    queryFn: async () => {
      const searchPattern = `%${effectiveSearchTerm}%`
      const response = await graphqlRequest<GQLSearchPokemonResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        SEARCH_POKEMON,
        { searchTerm: searchPattern } as GQLSearchPokemonVariables
      )
      return response
    },
    enabled: effectiveSearchTerm.length > 2,
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  })

  const suggestions = useMemo(() => {
    if (!data?.pokemon_v2_pokemon) {
      return []
    }
    return data.pokemon_v2_pokemon.map((pokemon) => ({
      id: pokemon.id.toString(),
      title: pokemon.name,
    }))
  }, [data])

  const hasResults = useMemo(() => {
    return suggestions.length > 0
  }, [suggestions.length])

  return {
    suggestions,
    isLoading: isFetching,
    isError,
    hasResults,
  }
}
