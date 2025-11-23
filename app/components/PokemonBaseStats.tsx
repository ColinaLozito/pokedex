import { Card, H4, Text, XStack, YStack } from 'tamagui'

interface StatInfo {
  base_stat: number
  stat: {
    name: string
    url: string
  }
}

interface PokemonBaseStatsProps {
  stats: StatInfo[]
  primaryTypeColor: string
}

export default function PokemonBaseStats({ stats, primaryTypeColor }: PokemonBaseStatsProps) {
  return (
    <Card>
      <Card.Header padded>
        <H4 marginBottom="$3">Base Stats</H4>
        <YStack gap="$3">
          {stats.map((statInfo) => (
            <YStack key={statInfo.stat.name} gap="$1">
              <XStack style={{ justifyContent: 'space-between' }}>
                <Text 
                  fontSize="$3" 
                  textTransform="capitalize"
                  color="$gray11"
                >
                  {statInfo.stat.name.replace('-', ' ')}
                </Text>
                <Text fontSize="$3" fontWeight="600">
                  {statInfo.base_stat}
                </Text>
              </XStack>
              <YStack
                style={{
                  height: 6,
                  backgroundColor: '$gray5',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <YStack
                  style={{
                    height: '100%',
                    width: `${(statInfo.base_stat / 255) * 100}%`,
                    backgroundColor: primaryTypeColor,
                  }}
                />
              </YStack>
            </YStack>
          ))}
        </YStack>
      </Card.Header>
    </Card>
  )
}

