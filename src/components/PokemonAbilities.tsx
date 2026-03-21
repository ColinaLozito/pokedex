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
        <H4 mb="$2" color="$text">Abilities</H4>
        <YStack gap="$2">
          {abilities.map((abilityInfo, index) => (
            <XStack key={index} gap="$2" items="center">
              <Text
                fontSize="$3"
                textTransform="capitalize"
                color="$text"
              >
                {abilityInfo.ability.name.replace('-', ' ')}
              </Text>
              {abilityInfo.is_hidden && (
                <Text
                  fontSize="$1"
                  color="$doveGray"
                  bg="$mercury"
                  px="$2"
                  py="$1"
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

