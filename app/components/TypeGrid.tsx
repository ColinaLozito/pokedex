import typeSymbolsIcons from 'app/utils/typeSymbolsIcons'
import { pokemonTypeColors } from 'config/colors'
import { useCallback, useMemo } from 'react'
import { Card, GetThemeValueForKey, H4, Image, Text, useTheme, XStack, YStack } from 'tamagui'

export interface TypeGridItem {
  id: number
  name: string
}

interface TypeGridProps {
  typeList: TypeGridItem[]
  onTypeSelect?: (typeId: number, typeName: string) => void
}

// Get color for type, fallback to gray if not found
// Moved outside component since it doesn't depend on props/state
const getTypeColor = (typeName: string): string => {
  return (pokemonTypeColors[typeName as keyof typeof pokemonTypeColors] || '#A8A77A')
}

// Constant style for type icons - moved outside component to avoid recreation
const typeIconStyle = {
  width: 50,
  height: 50,
  opacity: 0.8,
}

export default function TypeGrid({ typeList, onTypeSelect }: TypeGridProps) {
  const theme = useTheme()
  
  // Hooks must be called before any early returns
  const handleTypePress = useCallback((typeId: number, typeName: string) => {
    onTypeSelect?.(typeId, typeName)
  }, [onTypeSelect])

  // Split types into pairs for 2-column layout
  const rows = useMemo(() => {
    const result: TypeGridItem[][] = []
    for (let i = 0; i < typeList.length; i += 2) {
      result.push(typeList.slice(i, i + 2))
    }
    return result
  }, [typeList])

  if (typeList.length === 0) {
    return null
  }

  return (
    <YStack gap={12}>
      <H4 color={theme.text.val}>Pokémon Types</H4>
      <YStack gap={8}>
        {rows.map((row, rowIndex) => (
          <XStack key={rowIndex} gap={8} width="100%">
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
                    gap={8}
                  >
                    <YStack flex={1}>
                      <Text 
                        fontSize={16} 
                        textTransform="capitalize"
                        color="white"
                        fontWeight={800}
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

