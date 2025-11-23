import { Card, H4, Text, XStack, YStack } from 'tamagui'

interface AbilityInfo {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
}

interface PokemonAbilitiesProps {
  abilities: AbilityInfo[]
}

export default function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  return (
    <Card>
      <Card.Header padded>
        <H4 marginBottom="$2">Abilities</H4>
        <YStack gap="$2">
          {abilities.map((abilityInfo, index) => (
            <XStack key={index} gap="$2" style={{ alignItems: 'center' }}>
              <Text 
                fontSize="$4" 
                textTransform="capitalize"
              >
                {abilityInfo.ability.name.replace('-', ' ')}
              </Text>
              {abilityInfo.is_hidden && (
                <Text 
                  fontSize="$2" 
                  color="$gray10"
                  backgroundColor="$gray4"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  Hidden
                </Text>
              )}
            </XStack>
          ))}
        </YStack>
      </Card.Header>
    </Card>
  )
}

