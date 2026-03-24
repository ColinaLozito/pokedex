import { AttributeRowProps, PokemonAttributesProps } from '@/screens/pokemonDetails/types'
import { Card, Text, XStack, YStack } from 'tamagui'

export default function PokemonAttributes({ species, height, weight }: PokemonAttributesProps) {
  
  const heightAtribute = height ? `${(height / 10).toFixed(1)} m` : 'Unknown'
  const weightAtribute = weight ? `${(weight / 10).toFixed(1)} kg` : 'Unknown'
  
  return (
    <Card>
      <Card.Header padded>
        <XStack justify="space-around" items="flex-start">
          {species && (
            <>
              <AttributeRow label="Species" value={species} />
              <AttributeDivider />
            </>
          )}
          
          <AttributeRow label="Height" value={heightAtribute} />
          <AttributeDivider />
          <AttributeRow label="Weight" value={weightAtribute} />
        </XStack>
      </Card.Header>
    </Card>
  )
}

function AttributeRow({ label, value }: AttributeRowProps) {
  return (
    <YStack flex={1} items="center">
      <Text fontSize="$1" color="$text" mb="$1">
        {label}
      </Text>
      <Text fontSize="$2" fontWeight="$6" textAlign="center" color="$text">
        {value}
      </Text>
    </YStack>
  )
}

function AttributeDivider() {
  return <YStack width={1} height="100%" bg="$border" mx="$2" />
}


