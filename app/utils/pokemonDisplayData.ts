import type { CombinedPokemonDetail, PokemonDetail } from 'app/services/types'
import { getPokemonSprite, getPokemonSpriteUrl } from './pokemonSprites'

export interface PokemonDisplayData {
  id: number
  name: string
  sprite: string
  primaryType?: string
  types?: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
}

/**
 * Transform Pokemon data into display-ready format
 * Handles both full details and basic cache data
 * 
 * @param id - Pokemon ID
 * @param name - Pokemon name (fallback if not in cache)
 * @param getPokemonDetail - Function to get full Pokemon details
 * @param getBasicPokemon - Function to get basic Pokemon data
 * @returns Display-ready Pokemon data object
 */
export function transformPokemonToDisplayData(
  id: number,
  name: string,
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined,
  getBasicPokemon: (id: number) => PokemonDetail | undefined
): PokemonDisplayData {
  // Try to get full details first, fall back to basic cache
  const fullData = getPokemonDetail(id)
  const basicData = getBasicPokemon(id)
  
  // Get all types and primary type
  const types = fullData?.types || basicData?.types || undefined
  const primaryType = types?.[0]?.type?.name || undefined
  
  // Use direct sprite URL (no need to fetch just for sprite)
  // If we have cached data, use it; otherwise use direct URL
  const sprite = fullData 
    ? getPokemonSprite(fullData, id)
    : (basicData 
      ? getPokemonSprite(basicData, id)
      : getPokemonSpriteUrl(id))
  
  return {
    id,
    name: fullData?.name || basicData?.name || name,
    sprite,
    primaryType,
    types
  }
}

