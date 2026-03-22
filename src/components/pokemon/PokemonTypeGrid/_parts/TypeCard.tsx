import { getTypeColor } from '@/utils/getTypeColor'
import typeSymbolsIcons from 'src/utils/typeSymbolsIcons'
import { Card, GetThemeValueForKey, Image, Text, XStack, YStack } from 'tamagui'
import { TypeCardProps } from '../types'

export default function TypeCard({ type, onPress }: TypeCardProps) {
  
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
