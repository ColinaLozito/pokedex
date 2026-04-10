import { pokemonTypeColors } from '@theme/colors'
import typeSymbolsIcons from '../../ui/typeIcons'

export interface PokemonTypeStyles {
  typeColor: string
  typeIcon: object | number | null
}

export function getPokemonTypeStyles(typeName: string): PokemonTypeStyles {
  const normalized = typeName.toLowerCase()
  const typeColor =
    pokemonTypeColors[normalized as keyof typeof pokemonTypeColors] || '$hillary'
  const typeIcon =
    typeSymbolsIcons[normalized as keyof typeof typeSymbolsIcons]

  return { typeColor, typeIcon }
}

export { pokemonTypeColors }
