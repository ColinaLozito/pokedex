export type { PokemonDisplayDataArray } from '@/types/global'
import type { PokemonDisplayDataArray } from '@/types/global'
import type { PokemonDisplayData } from '@/types/global'
import type { CombinedPokemonDetail, PokemonListItem } from 'src/services/types'
import { getPokemonSprite, getPokemonSpriteUrl } from './sprites'

/**
 * Transform Pokemon list to display-ready data with sprites and types
 * @param pokemonList - List of Pokemon items to transform
 * @param pokemonDetails - Record of full Pokemon details by ID
 * @param fallbackType - Optional fallback type if Pokemon has no type data
 * @returns Array of display-ready Pokemon data
 */
export function getPokemonDisplayData(
  pokemonList: PokemonListItem[],
  pokemonDetails: Record<number, CombinedPokemonDetail>,
  fallbackType?: string
): PokemonDisplayDataArray {
  return pokemonList.map((pokemon) => {
    const cachedData = pokemonDetails[pokemon.id]
    const types = cachedData?.types || undefined
    const primaryType =
      types?.[0]?.type?.name || fallbackType?.toLowerCase() || 'normal'

    const sprite = cachedData
      ? getPokemonSprite(cachedData, pokemon.id)
      : getPokemonSpriteUrl(pokemon.id)

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite,
      primaryType,
      types,
    }
  })
}

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
  const cachedData = getPokemonDetail(id)
  
  const types = cachedData?.types || undefined
  const primaryType = types?.[0]?.type?.name || undefined
  
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
