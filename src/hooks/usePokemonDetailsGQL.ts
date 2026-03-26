import { useQuery } from '@tanstack/react-query'
import graphqlRequest from 'graphql-request'
import { useMemo } from 'react'
import type { CombinedPokemonDetail, PokemonAbilityEntry, PokemonStatEntry, PokemonTypeSlot, EvolutionPokemon, EvolutionChainLink } from 'src/services/types'
import { extractPokemonId } from 'src/utils/api/extractId'
import { extractEvolutionChain } from 'src/utils/evolution/evolutionTree'
import { sortStatsByOrder } from 'src/utils/pokemon/statOrder'
import { getPokemonSpriteUrl } from 'src/utils/pokemon/sprites'
import {
  GET_POKEMON_DETAILS,
  POKEAPI_GQL_V2_ENDPOINT,
  type GQLPokemonDetailsResponse,
  type GQLPokemonDetailsVariables,
} from '../services/queries/pokemonQueries'

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2/'

interface PokemonSpeciesResponse {
  readonly id: number
  readonly name: string
  readonly flavor_text_entries: Array<{
    readonly flavor_text: string
    readonly language: { readonly name: string }
  }>
  readonly genera: Array<{
    readonly genus: string
    readonly language: { readonly name: string }
  }>
  readonly habitat: { readonly name: string } | null
  readonly is_legendary: boolean
  readonly is_mythical: boolean
  readonly evolution_chain: { readonly url: string } | null
}

async function fetchPokemonSpecies(id: number): Promise<PokemonSpeciesResponse> {
  const response = await fetch(`${POKEMON_API_BASE}pokemon-species/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch species: ${response.status}`)
  }
  return response.json()
}

async function fetchEvolutionChain(url: string): Promise<{ chain: EvolutionChainLink }> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.status}`)
  }
  return response.json()
}

export interface UsePokemonDetailsGQLOptions {
  id: number
  enabled?: boolean
}

export interface UsePokemonDetailsGQLReturn {
  data: CombinedPokemonDetail | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

interface GQLSpritesRaw {
  sprites: string
}

function parseSprites(spritesArray: GQLSpritesRaw[]): CombinedPokemonDetail['sprites'] {
  if (!spritesArray || spritesArray.length === 0) {
    return {
      front_default: null,
      front_shiny: null,
    }
  }

  try {
    const spritesJson = JSON.parse(spritesArray[0].sprites)
    return {
      front_default: spritesJson?.front_default || null,
      front_shiny: spritesJson?.front_shiny || null,
      other: spritesJson?.other || undefined,
    }
  } catch {
    return {
      front_default: null,
      front_shiny: null,
    }
  }
}

function transformToCombinedDetail(
  response: GQLPokemonDetailsResponse | undefined,
  speciesData: {
    genus: string; 
    flavorText: string; 
    habitat: string | null; 
    isLegendary: boolean; 
    isMythical: boolean 
  } | null,
  evolutionData: { flat: EvolutionPokemon[], tree: EvolutionChainLink | null }
): CombinedPokemonDetail | undefined {
  if (!response?.pokemon_v2_pokemon || response.pokemon_v2_pokemon.length === 0) {
    return undefined
  }

  const pokemon = response.pokemon_v2_pokemon[0]

  const types: PokemonTypeSlot[] = pokemon.pokemon_v2_pokemontypes.map((pt) => ({
    slot: pt.slot,
    type: {
      name: pt.pokemon_v2_type.name,
    },
  }))

  const stats: PokemonStatEntry[] = pokemon.pokemon_v2_pokemonstats.map((stat) => ({
    base_stat: stat.base_stat,
    stat: {
      name: stat.pokemon_v2_stat.name,
      url: '',
    },
  }))

  const sortedStats = sortStatsByOrder(stats)

  const abilities: PokemonAbilityEntry[] = pokemon.pokemon_v2_pokemonabilities.map((ability) => ({
    ability: {
      name: ability.pokemon_v2_ability.name,
      url: '',
    },
    is_hidden: ability.is_hidden,
  }))

  const gqlSprites = parseSprites(pokemon.pokemon_v2_pokemonsprites)
  const spriteUrl = gqlSprites.front_default || getPokemonSpriteUrl(pokemon.id)

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: {
      front_default: spriteUrl,
      front_shiny: gqlSprites.front_shiny,
    },
    types,
    stats: sortedStats,
    abilities,
    speciesInfo: speciesData || {
      genus: 'Unknown',
      flavorText: 'No description available.',
      habitat: null,
      isLegendary: false,
      isMythical: false,
    },
    evolutionChain: evolutionData.flat,
    evolutionChainTree: evolutionData.tree || undefined,
  }
}

interface SpeciesData {
  genus: string
  flavorText: string
  habitat: string | null
  isLegendary: boolean
  isMythical: boolean
  evolutionChainUrl: string | null
}

async function fetchSpeciesData(id: number): Promise<SpeciesData | null> {
  try {
    const species = await fetchPokemonSpecies(id)
    const englishFlavorText = species.flavor_text_entries
      .find(entry => entry.language.name === 'en')?.flavor_text
      ?.replace(/\f/g, ' ') || 'No description available.'
    const englishGenus = species.genera
      .find(genus => genus.language.name === 'en')?.genus || 'Unknown'
    return {
      genus: englishGenus,
      flavorText: englishFlavorText,
      habitat: species.habitat?.name || null,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      evolutionChainUrl: species.evolution_chain?.url || null,
    }
  } catch {
    return null
  }
}

async function fetchEvolutionData(id: number): 
  Promise<{ flat: EvolutionPokemon[], tree: EvolutionChainLink | null }> {
  try {
    const species = await fetchPokemonSpecies(id)
    if (!species.evolution_chain?.url) {
      return { flat: [], tree: null }
    }
    const evolutionData = await fetchEvolutionChain(species.evolution_chain.url)
    const evolutionSpeciesList = extractEvolutionChain(evolutionData.chain)
    const flatChain = evolutionSpeciesList.map((species) => {
      const speciesId = extractPokemonId(species.url)
      return {
        id: speciesId,
        name: species.name,
      }
    })
    return { flat: flatChain, tree: evolutionData.chain }
  } catch {
    return { flat: [], tree: null }
  }
}

export function usePokemonDetailsGQL({
  id,
  enabled = true,
}: UsePokemonDetailsGQLOptions): UsePokemonDetailsGQLReturn {
  const { data: gqlData, isLoading, isFetching, isError, error, refetch } = useQuery({
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
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  })

  const { data: speciesData } = useQuery({
    queryKey: ['pokemonSpecies', id],
    queryFn: async () => {
      return fetchSpeciesData(id)
    },
    enabled: enabled && !!id && !!gqlData,
    staleTime: 1000 * 60 * 60,
  })

  const { data: evolutionChain } = useQuery({
    queryKey: ['pokemonEvolution', id],
    queryFn: async () => {
      return fetchEvolutionData(id)
    },
    enabled: enabled && !!id && !!speciesData?.evolutionChainUrl,
    staleTime: 1000 * 60 * 60,
  })

  const transformedData = useMemo(() => {
    return transformToCombinedDetail(
      gqlData, 
      speciesData || null, 
      evolutionChain || { flat: [], tree: null }
    )
  }, [gqlData, speciesData, evolutionChain])

  return {
    data: transformedData,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  }
}

export async function fetchFullPokemonData(id: number): Promise<CombinedPokemonDetail | undefined> {
  try {
    const variables: GQLPokemonDetailsVariables = { id }
    const gqlResponse = await graphqlRequest<GQLPokemonDetailsResponse>(
      POKEAPI_GQL_V2_ENDPOINT,
      GET_POKEMON_DETAILS,
      variables
    )

    if (!gqlResponse?.pokemon_v2_pokemon || gqlResponse.pokemon_v2_pokemon.length === 0) {
      return undefined
    }

    const speciesData = await fetchSpeciesData(id)
    const evolutionData = await fetchEvolutionData(id)

    return transformToCombinedDetail(
      gqlResponse,
      speciesData,
      evolutionData
    )
  } catch {
    return undefined
  }
}
