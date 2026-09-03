import { XStack, YStack } from 'tamagui'
import type { GameStatus } from '../whos-that-pokemon.types'
import { OptionCard } from './option-card'

interface OptionsGridProps {
  options: string[]
  correctName: string
  selectedOption: string | null
  status: GameStatus
  onSelect: (name: string) => void
}

export function OptionsGrid(
  { options, correctName, selectedOption, status, onSelect }: OptionsGridProps) {
  
  const rows: string[][] = []
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2))
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <XStack key={rowIndex} gap="$3">
          {row.map((name) => (
            <OptionCard
              key={name}
              name={name}
              status={status}
              isSelected={name === selectedOption}
              isCorrect={name === correctName}
              onPress={() => onSelect(name)}
            />
          ))}
          {row.length === 1 && <YStack flex={1} />}
        </XStack>
      ))}
    </>
  )
}
