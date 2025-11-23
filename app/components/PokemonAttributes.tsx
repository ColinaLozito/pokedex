import { Card, Text, XStack, YStack, useTheme } from 'tamagui'

interface PokemonAttributesProps {
  species?: string
  height: number // in decimeters
  weight: number // in hectograms
}

export default function PokemonAttributes({ species, height, weight }: PokemonAttributesProps) {
  const theme = useTheme()
  
  return (
    <Card>
      <Card.Header padded>
        <XStack style={{ justifyContent: 'space-around', alignItems: 'flex-start' }}>
          {/* Species */}
          {species && (
            <>
              <YStack style={{ flex: 1, alignItems: 'center' }}>
                <Text fontSize={12} color={theme.text.val} style={{ marginBottom: 4 }}>
                  Species
                </Text>
                <Text fontSize={14} fontWeight="600" style={{ textAlign: 'center' }} color={theme.text.val}>
                  {species}
                </Text>
              </YStack>
              <YStack style={{ width: 1, height: '100%', backgroundColor: '#E0E0E0', marginHorizontal: 8 }} />
            </>
          )}
          
          {/* Height */}
          <YStack style={{ flex: 1, alignItems: 'center' }}>
            <Text fontSize={12} color={theme.text.val} style={{ marginBottom: 4 }}>
              Height
            </Text>
            <Text fontSize={14} fontWeight="600" style={{ textAlign: 'center' }} color={theme.text.val}>
              {(height / 10).toFixed(1)} m
            </Text>
          </YStack>
          
          {/* Vertical Divider */}
          <YStack style={{ width: 1, height: '100%', backgroundColor: '#E0E0E0', marginHorizontal: 8 }} />
          
          {/* Weight */}
          <YStack style={{ flex: 1, alignItems: 'center' }}>
            <Text fontSize={12} color={theme.text.val} style={{ marginBottom: 4 }}>
              Weight
            </Text>
            <Text fontSize={14} fontWeight="600" style={{ textAlign: 'center' }} color={theme.text.val}>
              {(weight / 10).toFixed(1)} kg
            </Text>
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  )
}

