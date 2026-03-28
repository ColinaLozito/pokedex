import { useCallback } from 'react'
import { getQueryClient } from '@/providers/MainProvidersWrapper'
import type { CombinedPokemonDetail } from '@/shared/types/pokemon.domain'
import type { GQLPokemonDetailsResponse } from '@/shared/api/queries/pokemonQueries'
import { getPokemonSpriteUrl } from '@/utils/pokemon/sprites'

function transformGQLToCombinedDetail(
  gqlData: GQLPokemonDetailsResponse,
  _speciesData: unknown,
  _evolutionData: unknown
): CombinedPokemonDetail | undefined {
  if (!gqlData?.pokemon_v2_pokemon || gqlData.pokemon_v2_pokemon.length === 0) {
    return undefined
  }
  
  const pokemon = gqlData.pokemon_v2_pokemon[0]
  
  let spritesData: { 
    front_default?: string
    front_shiny?: string
    other?: { 
      'official-artwork'?: { front_default?: string }
      home?: { front_default?: string }
    }
  } = {}
  
  try {
    const spritesRaw = pokemon.pokemon_v2_pokemonsprites?.[0]?.sprites
    if (typeof spritesRaw === 'string') {
      spritesData = JSON.parse(spritesRaw)
    } else if (typeof spritesRaw === 'object' && spritesRaw !== null) {
      spritesData = spritesRaw as typeof spritesData
    }
  } catch {
    spritesData = {}
  }
  
  const officialArtwork = spritesData.other?.['official-artwork']?.front_default
  const homeSprite = spritesData.other?.home?.front_default
  const spriteUrl = officialArtwork || homeSprite || getPokemonSpriteUrl(pokemon.id)
  
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: {
      front_default: spriteUrl,
      front_shiny: spritesData.front_shiny || getPokemonSpriteUrl(pokemon.id),
    },
    types: pokemon.pokemon_v2_pokemontypes?.map((pt: unknown) => ({
      slot: (pt as { slot: number }).slot,
      type: {
        name: (pt as { pokemon_v2_type: { name: string } }).pokemon_v2_type.name,
      },
    })) || [],
    stats: [],
    abilities: [],
    speciesInfo: {
      genus: 'Unknown',
      flavorText: '',
      habitat: null,
      isLegendary: false,
      isMythical: false,
    },
    evolutionChain: [],
    evolutionChainTree: undefined,
  }
}

export function getCachedPokemonDetail(id: number): CombinedPokemonDetail | undefined {
  const client = getQueryClient()
  const data = client.getQueryData(['pokemonDetails', id])
  if (!data) return undefined
  
  const gqlData = data as GQLPokemonDetailsResponse
  const speciesData = client.getQueryData(['pokemonSpecies', id])
  const evolutionData = client.getQueryData(['pokemonEvolution', id])
  
  return transformGQLToCombinedDetail(gqlData, speciesData, evolutionData)
}

export function useGetCachedPokemonDetail() {
  const getDetail = useCallback((id: number) => {
    return getCachedPokemonDetail(id)
  }, [])
  
  return getDetail
}
