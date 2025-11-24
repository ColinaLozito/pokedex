import { Card, H4, Text, XStack, YStack, useTheme } from 'tamagui'

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
  const theme = useTheme()
  
  return (
    <Card>
      <Card.Header padded>
        <H4 mb={12} color={theme.text.val}>Base Stats</H4>
        <YStack gap={12}>
          {stats.map((statInfo) => (
            <YStack key={statInfo.stat.name} gap={4}>
              <XStack justify="space-between">
                <Text 
                  fontSize={14} 
                  textTransform="capitalize"
                  color={theme.text.val}
                >
                  {statInfo.stat.name.replace('-', ' ')}
                </Text>
                <Text fontSize={14} fontWeight="600" color={theme.text.val}>
                  {statInfo.base_stat}
                </Text>
              </XStack>
              <YStack
                height={6}
                bg={theme.gray5?.val || '#F5F5F5'}
                borderRadius={8}
                overflow='hidden'
              >
                <YStack
                  height='100%'
                  width={`${(statInfo.base_stat / 255) * 100}%`}
                  bg={primaryTypeColor as any}
                />
              </YStack>
            </YStack>
          ))}
        </YStack>
      </Card.Header>
    </Card>
  )
}

