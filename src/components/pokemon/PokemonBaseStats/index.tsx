import { Card, GetThemeValueForKey, H4, Text, XStack, YStack } from 'tamagui'
import { calculateStatBarPercentage } from './constants'
import type { PokemonBaseStatsProps } from './types'

export default function PokemonBaseStats({ stats, primaryTypeColor }: PokemonBaseStatsProps) {
  return (
    <Card>
      <Card.Header padded>
        <H4 mb="$3" color="$text">Base Stats</H4>
        <YStack gap="$3">
          {stats.map((statInfo) => (
            <YStack key={statInfo.stat.name} gap="$1">
              <XStack justify="space-between">
                <Text
                  fontSize="$2"
                  textTransform="capitalize"
                  color="$text"
                >
                  {statInfo.stat.name.replace('-', ' ')}
                </Text>
                <Text fontSize="$2" fontWeight="$6" color="$text">
                  {statInfo.base_stat}
                </Text>
              </XStack>
              <YStack
                height="$2"
                bg="$wildSand"
                borderRadius="$2"
                overflow="hidden"
              >
                <YStack
                  height="100%"
                  width={calculateStatBarPercentage(statInfo.base_stat)}
                  bg={primaryTypeColor as GetThemeValueForKey<"backgroundColor">}
                />
              </YStack>
            </YStack>
          ))}
        </YStack>
      </Card.Header>
    </Card>
  )
}
