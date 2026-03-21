import { getTypeColor } from '@/utils/getTypeColor'
import { useCallback, useMemo } from 'react'
import typeSymbolsIcons from 'src/utils/typeSymbolsIcons'
import { Card, GetThemeValueForKey, H4, Image, Text, XStack, YStack } from 'tamagui'
import { typeIconStyle } from './constans'
import { TypeGridItem, TypeGridProps } from './types'

export default function PokemonTypeGrid({ typeList, onTypeSelect }: TypeGridProps) {
  // Hooks must be called before any early returns
  const handleTypePress = useCallback((typeId: number, typeName: string) => {
    onTypeSelect?.(typeId, typeName)
  }, [onTypeSelect])

  // Split types into pairs for 2-column layout
  const rows = useMemo(() => {
    const result: TypeGridItem[][] = []
    for (let item = 0; item < typeList.length; item += 2) {
      result.push(typeList.slice(item, item + 2))
    }
    return result
  }, [typeList])

  if (typeList.length === 0) {
    return null
  }

  return (
    <YStack gap="$3">
      <H4 color="$text">Pokémon Types</H4>
      <YStack gap="$2">
        {rows.map((row, rowIndex) => (
          <XStack key={rowIndex} gap="$2" width="100%">
            {row.map((type) => (
              <Card
                key={type.id}
                flex={1}
                borderWidth={0}
                animation="bouncy"
                hoverStyle={{ scale: 0.98 }}
                pressStyle={{ scale: 0.95 }}
                onPress={() => handleTypePress(type.id, type.name)}
                backgroundColor={(getTypeColor(type.name)) as GetThemeValueForKey<"backgroundColor">}
              >
                <Card.Header padded>
                  <XStack
                    justify="space-between"
                    items="center"
                    gap="$2"
                  >
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
                      source={typeSymbolsIcons[
                        type.name.toLowerCase() as keyof typeof typeSymbolsIcons
                      ]}
                      style={typeIconStyle}
                      objectFit="contain"
                    />
                  </XStack>
                </Card.Header>
              </Card>
            ))}
            {/* Fill empty space if odd number of types */}
            {row.length === 1 && <YStack flex={1} />}
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
}

