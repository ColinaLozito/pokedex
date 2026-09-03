import { Card, Text, XStack } from 'tamagui'
import type { GameStatus } from '../whos-that-pokemon.types'

interface OptionCardProps {
  name: string
  status: GameStatus
  isSelected: boolean
  isCorrect: boolean
  onPress: () => void
}

export function OptionCard({ name, status, isSelected, isCorrect, onPress }: OptionCardProps) {
  const isPlaying = status === 'playing'
  const isHighlighted = !isPlaying && (isCorrect || isSelected)

  const bgColor = isCorrect
    ? '#22c55e'
    : (isSelected ? '#ef4444' : '#f5f5f5')

  return (
    <Card
      flex={1}
      borderWidth={0}
      onPress={isPlaying ? onPress : undefined}
      pressStyle={{ scale: 0.95 }}
      transition="slow"
      elevation={5}
      backgroundColor={isPlaying ? '#f5f5f5' : bgColor}
    >
      <Card.Header>
        <XStack justifyContent="center" alignItems="center">
          <Text
            color={isHighlighted ? '$white' : '$color12'}
            fontSize="$3"
            fontWeight="$6"
            textAlign="center"
          >
            {name}
          </Text>
        </XStack>
      </Card.Header>
    </Card>
  )
}
