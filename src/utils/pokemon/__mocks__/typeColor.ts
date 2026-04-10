import { pokemonTypeColors, baseColors } from '../../theme/colors'

export function getTypeColor(primaryType?: string): string {
  if (primaryType) {
    const typeColor = pokemonTypeColors[primaryType.toLowerCase() as keyof typeof pokemonTypeColors]
    if (typeColor) {
      return typeColor
    }
  }
  return baseColors.wildSand
}

export { pokemonTypeColors, baseColors }