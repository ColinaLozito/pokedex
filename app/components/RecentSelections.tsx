import { usePokemonStore } from 'app/store/pokemonStore'
import { X } from '@tamagui/lucide-icons'
import { Button, Card, H4, Text, XStack, YStack } from 'tamagui'

export default function RecentSelections() {
  const recentSelections = usePokemonStore((state) => state.recentSelections)
  const removeRecentSelection = usePokemonStore((state) => state.removeRecentSelection)

  if (recentSelections.length === 0) {
    return null
  }

  const handleRemove = (pokemonId: number) => {
    removeRecentSelection(pokemonId)
  }

  return (
    <YStack gap="$3">
      <H4>Recent Selections</H4>
      <YStack gap="$2">
        {recentSelections.map((pokemon) => (
          <Card
            key={pokemon.id}
            elevate
            size="$2"
            bordered
            animation="bouncy"
            hoverStyle={{ scale: 0.98 }}
            pressStyle={{ scale: 0.95 }}
          >
            <Card.Header padded>
              <XStack content="space-between" items="center" paddingInline={8}>
                <YStack flex={1}>
                  <Text fontSize="$3" fontWeight="600" textTransform="capitalize">
                    {pokemon.name}
                  </Text>
                  <Text fontSize="$2">
                    ID: {pokemon.id}
                  </Text>
                </YStack>
                <Button
                  size="$2"
                  circular
                  icon={X}
                  onPress={() => handleRemove(pokemon.id)}
                />
              </XStack>
            </Card.Header>
          </Card>
        ))}
      </YStack>
    </YStack>
  )
}

