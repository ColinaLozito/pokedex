import { Text, XStack } from 'tamagui'
import { PokemonCardHeaderProps } from '../types'

export default function PokemonCardHeader(
  { id, name, baseID = '' }: PokemonCardHeaderProps & { baseID?: string }
) {
  const headerTestID = baseID ? `${baseID}-header` : undefined
  
  return (
    <XStack justifyContent="space-between"  alignItems="center" testID={headerTestID}>
      <Text
        fontSize="$2"
        lineHeight="$3"
        fontWeight="$8"
        color="$white"
        textTransform="capitalize"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text
        fontSize="$2"
        fontWeight="$5"
        color="$white"
      >
        #{id.toString().padStart(3, '0')}
      </Text>
    </XStack>
  )
}
