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
        <XStack style={{ justifyContent: 'space-around', alignItems: 'flex-start' }}>
          {/* Species */}
          {species && (
            <>
              <YStack style={{ flex: 1, alignItems: 'center' }}>
                <Text fontSize="$1" color="$gray10" style={{ marginBottom: 4 }}>
                  Species
                </Text>
                <Text fontSize="$3" fontWeight="600" style={{ textAlign: 'center' }}>
                  {species}
                </Text>
              </YStack>
              <YStack style={{ width: 1, height: '100%', backgroundColor: '#E0E0E0', marginHorizontal: 8 }} />
            </>
          )}
          
          {/* Height */}
          <YStack style={{ flex: 1, alignItems: 'center' }}>
            <Text fontSize="$1" color="$gray10" style={{ marginBottom: 4 }}>
              Height
            </Text>
            <Text fontSize="$3" fontWeight="600" style={{ textAlign: 'center' }}>
              {(height / 10).toFixed(1)} m
            </Text>
          </YStack>
          
          {/* Vertical Divider */}
          <YStack style={{ width: 1, height: '100%', backgroundColor: '#E0E0E0', marginHorizontal: 8 }} />
          
          {/* Weight */}
          <YStack style={{ flex: 1, alignItems: 'center' }}>
            <Text fontSize="$1" color="$gray10" style={{ marginBottom: 4 }}>
              Weight
            </Text>
            <Text fontSize="$3" fontWeight="600" style={{ textAlign: 'center' }}>
              {(weight / 10).toFixed(1)} kg
            </Text>
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  )
}

