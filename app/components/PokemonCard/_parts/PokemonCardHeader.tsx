import { XStack, Text } from 'tamagui'
import { PokemonCardHeaderProps } from '../types'

export default function PokemonCardHeader({ id, name }: PokemonCardHeaderProps) {
  return (
    <XStack justify='space-between' items='center'>
      <Text 
        fontSize={14} 
        color="white" 
        textTransform="capitalize"
        numberOfLines={1}
        lineHeight={24}
        fontWeight={800}
      >
        {name}
      </Text>
      <Text 
        fontSize={14} 
        color="white"
        fontWeight={500}
      >
        #{id.toString().padStart(3, '0')}
      </Text>
    </XStack>
  )
}
