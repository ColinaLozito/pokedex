import { pokemonTypeColors } from '@theme/colors'
import type { ImageSourcePropType } from 'react-native'
import typeSymbolsIcons from 'src/utils/ui/typeIcons'
import { GetThemeValueForKey } from 'tamagui'

interface PokemonTypeStyles {
  typeColor: string | GetThemeValueForKey<"backgroundColor">
  typeIcon: ImageSourcePropType | undefined
}

export function getPokemonTypeStyles(typeName: string): PokemonTypeStyles {
  const normalized = typeName.toLowerCase()
  const typeColor =
    pokemonTypeColors[normalized as keyof typeof pokemonTypeColors] || '$hillary'
  const typeIcon =
    typeSymbolsIcons[normalized as keyof typeof typeSymbolsIcons]

  return { typeColor, typeIcon }
}
