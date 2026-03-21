import { XStack } from 'tamagui'
import TypeBadge from '../../common/TypeBadge'
import { TypeChipsProps } from './types'
 
export default function TypeChips({ types, size = 'medium', gap = '$2' }: TypeChipsProps) {
  if (!types || types.length === 0) {
    return null
  }

  return (
    <XStack flexWrap="wrap" gap={gap} justify="center" minWidth="100%">
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
