import type { CombinedPokemonDetail, PokemonDetail } from '../services/types'

/**
 * Base URL for Pokemon official artwork sprites
 * Pattern: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
 */
const POKEMON_SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

/**
 * Generate Pokemon sprite URL from Pokemon ID
 * @param id - Pokemon ID (number)
 * @returns Full URL to the Pokemon's official artwork sprite
 * 
 * @example
 * getPokemonSpriteUrl(25) // Returns URL for Pikachu
 * getPokemonSpriteUrl(1)  // Returns URL for Bulbasaur
 */
export function getPokemonSpriteUrl(id: number): string {
  return `${POKEMON_SPRITE_BASE_URL}${id}.png`
}

/**
 * Get Pokemon sprite URL from Pokemon data (with fallback to ID-based URL)
 * @param pokemonData - Pokemon data object (optional)
 * @param pokemonId - Pokemon ID as fallback
 * @returns Sprite URL, preferring official artwork, falling back to ID-based URL
 */
export function getPokemonSprite(
  pokemonData: PokemonDetail | CombinedPokemonDetail | undefined,
  pokemonId: number
): string {
  // If we have Pokemon data, try to get sprite from it
  if (pokemonData?.sprites) {
    const sprite = 
      pokemonData.sprites.other?.['official-artwork']?.front_default ||
      pokemonData.sprites.other?.home?.front_default ||
      pokemonData.sprites.front_default
    
    if (sprite) {
      return sprite
    }
  }
  
  // Fallback to direct URL based on ID
  return getPokemonSpriteUrl(pokemonId)
}

