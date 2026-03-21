import { Text, XStack } from 'tamagui'
import { PokemonCardHeaderProps } from '../types'

export default function PokemonCardHeader({ id, name }: PokemonCardHeaderProps) {
  return (
    <XStack justify="space-between" items="center">
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
