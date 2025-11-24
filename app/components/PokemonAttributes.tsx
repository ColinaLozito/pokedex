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
        <XStack justify='space-around' items='flex-start'>
          {/* Species */}
          {species && (
            <>
              <YStack flex={1} items='center'>
                <Text fontSize={12} color={theme.text.val} mb={4}>
                  Species
                </Text>
                <Text fontSize={14} fontWeight="600" textAlign='center' color={theme.text.val}>
                  {species}
                </Text>
              </YStack>
              <YStack width={1} height='100%' bg='#E0E0E0' mx={8} />
            </>
          )}
          
          {/* Height */}
          <YStack flex={1} items='center'>
            <Text fontSize={12} color={theme.text.val} mb={4}>
              Height
            </Text>
            <Text fontSize={14} fontWeight="600" textAlign='center' color={theme.text.val}>
              {(height / 10).toFixed(1)} m
            </Text>
          </YStack>
          
          {/* Vertical Divider */}
          <YStack width={1} height='100%' bg='#E0E0E0' mx={8} />
          
          {/* Weight */}
          <YStack flex={1} items='center'>
            <Text fontSize={12} color={theme.text.val} mb={4}>
              Weight
            </Text>
            <Text fontSize={14} fontWeight="600" textAlign='center' color={theme.text.val}>
              {(weight / 10).toFixed(1)} kg
            </Text>
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  )
}

