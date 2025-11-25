import { Card, H4, Text, XStack, YStack, useTheme } from 'tamagui'

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
  const theme = useTheme()
  
  return (
    <Card>
      <Card.Header padded>
        <H4 mb={8} color={theme.text.val}>Abilities</H4>
        <YStack gap={8}>
          {abilities.map((abilityInfo, index) => (
            <XStack key={index} gap={8} items='center'>
              <Text 
                fontSize={16} 
                textTransform="capitalize"
                color={theme.text.val}
              >
                {abilityInfo.ability.name.replace('-', ' ')}
              </Text>
              {abilityInfo.is_hidden && (
                <Text 
                  fontSize={12} 
                  color={theme.gray10?.val || '#737373'}
                  bg={theme.gray4?.val || '#E5E5E5'}
                  px={8}
                  py={4}
                  borderRadius={6}
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

