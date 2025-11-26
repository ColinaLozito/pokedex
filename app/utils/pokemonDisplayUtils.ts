import type { CombinedPokemonDetail, PokemonListItem } from '../services/types'
import { getPokemonSprite, getPokemonSpriteUrl } from './pokemonSprites'

/**
 * Array of Pokemon display data items
 * Used for transforming lists of Pokemon into display-ready format
 */
export type PokemonDisplayDataArray = Array<{
  id: number
  name: string
  sprite: string | null
  primaryType: string
  types?: Array<{ slot: number; type: { name: string; url: string } }>
}>

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

