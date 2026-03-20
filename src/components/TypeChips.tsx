import { XStack } from 'tamagui'
import TypeBadge from './TypeBadge'

interface TypeChipsProps {
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  size?: 'small' | 'medium' | 'large'
  gap?: number
}

export default function TypeChips({ types, size = 'medium', gap = 8 }: TypeChipsProps) {
  if (!types || types.length === 0) {
    return null
  }

  return (
    <XStack flexWrap='wrap' gap={gap} justify="center" minWidth="100%">
      {types.map((typeInfo) => (
        <TypeBadge
          key={typeInfo.slot}
          typeName={typeInfo.type.name}
          size={size}
        />
      ))}
    </XStack>
  )
}

