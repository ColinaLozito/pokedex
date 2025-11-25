import { pokemonTypeColors } from "config/colors"

// Fallback colors for Pokemon cards without type
const FALLBACK_COLORS = {
  recent: '#F5F5F5', // Neutral gray for recent selections
  bookmark: '#E0E0E0', // Light gray for bookmarks
} as const

/**
 * Get type color for background based on Pokemon's primary type
 * @param primaryType - Pokemon's primary type name
 * @param variant - Card variant ('recent' or 'bookmark')
 * @returns Color string for the background
 */
export const getTypeColor = (
  primaryType: string | undefined,
  variant: 'recent' | 'bookmark'
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