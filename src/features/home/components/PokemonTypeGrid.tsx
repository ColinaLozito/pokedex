import { getTypeColor } from '@/utils/pokemon/typeColor'
import typeSymbolsIcons from '@/utils/ui/typeIcons'
import { Card, GetThemeValueForKey, H4, Image, Text, XStack, YStack } from 'tamagui'
import type { TypeCardProps, TypeGridProps } from '../home.types'

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


function TypeCard({ type, onPress }: TypeCardProps) {
  
  const typeSymbol = typeSymbolsIcons[type.name.toLowerCase() as keyof typeof typeSymbolsIcons]
  
  return (
    <Card
      flex={1}
      borderWidth={0}
      animation="bouncy"
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.95 }}
      onPress={() => onPress(type.id, type.name)}
      backgroundColor={getTypeColor(type.name) as GetThemeValueForKey<"backgroundColor">}
    >
      <Card.Header padded>
        <XStack justify="space-between" items="center" gap="$2">
          <YStack flex={1}>
            <Text
              fontSize="$3"
              textTransform="capitalize"
              color="$white"
              fontWeight="$6"
            >
              {type.name}
            </Text>
          </YStack>
          <Image
            source={typeSymbol}
            style={{ width: 24, height: 24, opacity: 0.8 }}
            objectFit="contain"
          />
        </XStack>
      </Card.Header>
    </Card>
  )
}
