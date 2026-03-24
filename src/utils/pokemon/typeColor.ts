import { baseColors, pokemonTypeColors } from "@theme/colors"

/**
 * Get type color for background based on Pokemon's primary type
 * @param primaryType - Pokemon's primary type name
 * @returns Color string for the background
 */
export const getTypeColor = (
  primaryType: string | undefined,
  
): string => {
  if (primaryType) {
    const typeColor = pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors]
    if (typeColor) {
      return typeColor
    }
  }
  // Fallback colors - neutral gray for recent, light gray for bookmark without type
  return baseColors.wildSand
}