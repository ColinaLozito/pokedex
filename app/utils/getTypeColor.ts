import { PokemonCardVariant } from "app/types/pokemonCardVariant"
import { pokemonTypeColors } from "config/colors"

// Fallback colors for Pokemon cards without type
const FALLBACK_COLORS: Record<PokemonCardVariant, string> = {
  [PokemonCardVariant.RECENT]: '#F5F5F5', // Neutral gray for recent selections
  [PokemonCardVariant.BOOKMARK]: '#E0E0E0', // Light gray for bookmarks
  [PokemonCardVariant.LIST]: '#FFFFFF', // White for list items
} as const

/**
 * Get type color for background based on Pokemon's primary type
 * @param primaryType - Pokemon's primary type name
 * @param variant - Card variant ('recent' or 'bookmark')
 * @returns Color string for the background
 */
export const getTypeColor = (
  primaryType: string | undefined,
  variant: PokemonCardVariant
  
): string => {
  if (primaryType) {
    const typeColor = pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors]
    if (typeColor) {
      return typeColor
    }
  }
  // Fallback colors - neutral gray for recent, light gray for bookmark without type
  return FALLBACK_COLORS[variant]
}