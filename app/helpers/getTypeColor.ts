import { pokemonTypeColors } from "config/colors"

 // Get type color for background
 export const getTypeColor = (primaryType: string | undefined, variant: 'recent' | 'bookmark') => {
    if (primaryType) {
      const typeColor = pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors]
      if (typeColor) {
        return typeColor
      }
    }
    // Fallback colors - neutral gray for recent, light gray for bookmark without type
    return variant === 'recent' ? '#F5F5F5' : '#E0E0E0'
  }