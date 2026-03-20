import { PokemonCardData } from '@/components/PokemonCard/types'
import type { CombinedPokemonDetail } from 'src/services/types'
import { getPokemonSprite, getPokemonSpriteUrl } from './pokemonSprites'

export type PokemonDisplayData = Omit<PokemonCardData, 'variant'> 

/**
 * Transform Pokemon data into display-ready format
 * Uses pokemonDetails cache, falls back to ID-based sprite URL if not cached
 * 
 * @param id - Pokemon ID
 * @param name - Pokemon name (fallback if not in cache)
 * @param getPokemonDetail - Function to get Pokemon details from cache
 * @returns Display-ready Pokemon data object
 */
export function transformPokemonToDisplayData(
  id: number,
  name: string,
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
): PokemonDisplayData {
  // Try to get cached data
  const cachedData = getPokemonDetail(id)
  
  // Get all types and primary type
  const types = cachedData?.types || undefined
  const primaryType = types?.[0]?.type?.name || undefined
  
  // Get sprite from cache if available, otherwise use ID-based URL
  const sprite = cachedData 
    ? getPokemonSprite(cachedData, id)
    : getPokemonSpriteUrl(id)
  
  return {
    id,
    name: cachedData?.name || name,
    sprite,
    primaryType,
    types
  }
}

