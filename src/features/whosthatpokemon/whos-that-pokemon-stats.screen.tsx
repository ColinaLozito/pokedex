import { useMemo } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { Card, Text, XStack, YStack } from 'tamagui'
import { usePokemonGameStore } from './store/use-pokemon-game-store'

export default function WhosThatPokemonStatsScreen() {
  const totalPlayed = usePokemonGameStore((s) => s.totalPlayed)
  const correctGuesses = usePokemonGameStore((s) => s.correctGuesses)

  const incorrectGuesses = totalPlayed - correctGuesses
  const accuracy = totalPlayed > 0 ? Math.round((correctGuesses / totalPlayed) * 100) : 0

  const chartData = useMemo(
    () => [
      { value: correctGuesses, color: '#22c55e' },
      { value: incorrectGuesses, color: '#dc2626' },
    ],
    [correctGuesses, incorrectGuesses],
  )

  const centerLabel = useMemo(
    () => (
      <Text fontSize={28} fontWeight="bold" color="$color12">
        {accuracy}%
      </Text>
    ),
    [accuracy],
  )

  return (
    <YStack flex={1} backgroundColor="white" padding="$6" gap="$6" justifyContent="center">
      {totalPlayed === 0 ? (
        <YStack alignItems="center" gap="$4">
          <Text fontSize="$8" fontWeight="bold" color="$color8">
            No games played yet
          </Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            Play Who&apos;s That Pokémon to see your stats here.
          </Text>
        </YStack>
      ) : (
        <>
          <YStack alignItems="center">
            <PieChart
              data={chartData}
              donut
              showText
              textColor="white"
              textSize={16}
              radius={120}
              innerRadius={60}
              focusOnPress
              centerLabelComponent={() => centerLabel}
            />
          </YStack>

          <YStack gap="$3" paddingHorizontal="$4">
            <Card borderWidth={1} borderColor="$color8" padding="$4" borderRadius="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" color="$color11">Total Games</Text>
                <Text fontSize="$4" fontWeight="bold" color="$color12">{totalPlayed}</Text>
              </XStack>
            </Card>

            <Card borderWidth={1} borderColor="$color8" padding="$4" borderRadius="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <YStack width={12} height={12} borderRadius={6} backgroundColor="#22c55e" />
                  <Text fontSize="$4" color="$color11">Right Answers</Text>
                </XStack>
                <Text fontSize="$4" fontWeight="bold" color="$color12">{correctGuesses}</Text>
              </XStack>
            </Card>

            <Card borderWidth={1} borderColor="$color8" padding="$4" borderRadius="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <YStack width={12} height={12} borderRadius={6} backgroundColor="#dc2626" />
                  <Text fontSize="$4" color="$color11">Wrong Answers</Text>
                </XStack>
                <Text fontSize="$4" fontWeight="bold" color="$color12">{incorrectGuesses}</Text>
              </XStack>
            </Card>
          </YStack>
        </>
      )}
    </YStack>
  )
}
