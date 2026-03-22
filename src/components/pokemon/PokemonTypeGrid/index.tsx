import { H4, XStack, YStack } from 'tamagui'
import TypeCard from './_parts/TypeCard'
import type { TypeGridProps } from './types'

export default function PokemonTypeGrid({ typeList, onTypeSelect }: TypeGridProps) {
  const handleTypePress = (typeId: number, typeName: string) => {
    onTypeSelect?.(typeId, typeName)
  }

  if (typeList.length === 0) {
    return null
  }

  return (
    <YStack gap="$3">
      <H4 color="$text">Pokémon Types</H4>
      <XStack flexWrap="wrap" gap="$2">
        {typeList.map((type) => (
          <YStack key={type.id} width="49%">    
            <TypeCard key={type.id} type={type} onPress={handleTypePress} />
          </YStack> 
        ))}
      </XStack>
    </YStack>
  )
}
