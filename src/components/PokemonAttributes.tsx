import { Card, Text, XStack, YStack } from 'tamagui'

interface PokemonAttributesProps {
  species?: string
  height: number // in decimeters
  weight: number // in hectograms
}

export default function PokemonAttributes({ species, height, weight }: PokemonAttributesProps) {
  return (
    <Card>
      <Card.Header padded>
        <XStack justify="space-around" items="flex-start">
          {/* Species */}
          {species && (
            <>
              <YStack flex={1} items="center">
                <Text fontSize="$1" color="$text" mb="$1">
                  Species
                </Text>
                <Text fontSize="$2" fontWeight="$6" textAlign="center" color="$text">
                  {species}
                </Text>
              </YStack>
              <YStack width={1} height="100%" bg="$border" mx="$2" />
            </>
          )}
          
          {/* Height */}
          <YStack flex={1} items="center">
            <Text fontSize="$1" color="$text" mb="$1">
              Height
            </Text>
            <Text fontSize="$2" fontWeight="$6" textAlign="center" color="$text">
              {(height / 10).toFixed(1)} m
            </Text>
          </YStack>
          
          {/* Vertical Divider */}
          <YStack width={1} height="100%" bg="$border" mx="$2" />
          
          {/* Weight */}
          <YStack flex={1} items="center">
            <Text fontSize="$1" color="$text" mb="$1">
              Weight
            </Text>
            <Text fontSize="$2" fontWeight="$6" textAlign="center" color="$text">
              {(weight / 10).toFixed(1)} kg
            </Text>
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  )
}

