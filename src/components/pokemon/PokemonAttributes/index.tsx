import { Card, XStack } from 'tamagui'
import AttributeDivider from './_parts/AttributeDivider'
import AttributeRow from './_parts/AttributeRow'
import type { PokemonAttributesProps } from './types'

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
