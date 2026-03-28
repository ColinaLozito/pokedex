/* eslint-disable max-len */
import graphqlRequest from 'graphql-request'
import { getQueryClient } from '@/providers/MainProvidersWrapper'
import {
  GET_POKEMON_DETAILS,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonDetailsResponse,
  type GQLPokemonDetailsVariables,
} from '@/shared/api/queries/pokemonQueries'

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2/'

interface PokemonSpeciesResponse {
  id: number
  name: string
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string }
  }>
  genera: Array<{
    genus: string
    language: { name: string }
  }>
  habitat: { name: string } | null
  is_legendary: boolean
  is_mythical: boolean
  evolution_chain: { url: string } | null
}

async function fetchPokemonSpecies(id: number): Promise<PokemonSpeciesResponse> {
  const response = await fetch(`${POKEMON_API_BASE}pokemon-species/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch species: ${response.status}`)
  }
  return response.json()
}

async function fetchEvolutionData(id: number): Promise<{ flat: Array<{ id: number; name: string }>; tree: unknown; evolutionIds: number[] }> {
  try {
    const species = await fetchPokemonSpecies(id)
    if (!species.evolution_chain?.url) {
      return { flat: [], tree: null, evolutionIds: [] }
    }
    const evolutionResponse = await fetch(species.evolution_chain.url)
    const evolutionData = await evolutionResponse.json()
    
    const extractEvolutionChain = (chain: { species: { name: string; url: string }; evolves_to: unknown[] }): Array<{ name: string; url: string }> => {
      const result: Array<{ name: string; url: string }> = []
      const traverse = (node: { species: { name: string; url: string }; evolves_to: unknown[] }) => {
        result.push({ name: node.species.name, url: node.species.url })
        if (node.evolves_to && node.evolves_to.length > 0) {
          node.evolves_to.forEach((evo: unknown) => traverse(evo as { species: { name: string; url: string }; evolves_to: unknown[] }))
        }
      }
      traverse(chain)
      return result
    }

    const speciesList = extractEvolutionChain(evolutionData.chain)
    const flatChain = speciesList.map((s) => {
      const idMatch = s.url.match(/\/(\d+)\/$/)
      return {
        id: idMatch ? parseInt(idMatch[1], 10) : 0,
        name: s.name,
      }
    }).filter(p => p.id > 0)

    const evolutionIds = flatChain.map(p => p.id)

    return { flat: flatChain, tree: evolutionData.chain, evolutionIds }
  } catch {
    return { flat: [], tree: null, evolutionIds: [] }
  }
}

async function prefetchSinglePokemonDetails(client: ReturnType<typeof getQueryClient>, id: number): Promise<void> {
  await client.prefetchQuery({
    queryKey: ['pokemonDetails', id],
    queryFn: async () => {
      const variables: GQLPokemonDetailsVariables = { id }
      const response = await graphqlRequest<GQLPokemonDetailsResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        GET_POKEMON_DETAILS,
        variables
      )
      return response
    },
    staleTime: 1000 * 60 * 5,
  })

  await client.prefetchQuery({
    queryKey: ['pokemonSpecies', id],
    queryFn: async () => {
      return fetchPokemonSpecies(id)
    },
    staleTime: 1000 * 60 * 60,
  })

  await client.prefetchQuery({
    queryKey: ['pokemonEvolution', id],
    queryFn: async () => {
      return fetchEvolutionData(id)
    },
    staleTime: 1000 * 60 * 60,
  })
}

export async function prefetchPokemonDetails(id: number): Promise<void> {
  const client = getQueryClient()
  
  await client.prefetchQuery({
    queryKey: ['pokemonDetails', id],
    queryFn: async () => {
      const variables: GQLPokemonDetailsVariables = { id }
      const response = await graphqlRequest<GQLPokemonDetailsResponse>(
        POKEAPI_GQL_V2_ENDPOINT,
        GET_POKEMON_DETAILS,
        variables
      )
      return response
    },
    staleTime: 1000 * 60 * 5,
  })

  await client.prefetchQuery({
    queryKey: ['pokemonSpecies', id],
    queryFn: async () => {
      return fetchPokemonSpecies(id)
    },
    staleTime: 1000 * 60 * 60,
  })

  await client.prefetchQuery({
    queryKey: ['pokemonEvolution', id],
    queryFn: async () => {
      return fetchEvolutionData(id)
    },
    staleTime: 1000 * 60 * 60,
  })

  const evolutionData = client.getQueryData(['pokemonEvolution', id]) as { evolutionIds: number[] } | undefined
  const evolutionIds = evolutionData?.evolutionIds || []
  
  const otherEvolutionIds = evolutionIds.filter(evoId => evoId !== id)
  
  if (otherEvolutionIds.length > 0) {
    await Promise.all(
      otherEvolutionIds.map(evoId => prefetchSinglePokemonDetails(client, evoId))
    )
  }
}
