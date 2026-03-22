import { Text, YStack } from 'tamagui'
import type { AttributeRowProps } from '../types'

export default function AttributeRow({ label, value }: AttributeRowProps) {
  return (
    <YStack flex={1} items="center">
      <Text fontSize="$1" color="$text" mb="$1">
        {label}
      </Text>
      <Text fontSize="$2" fontWeight="$6" textAlign="center" color="$text">
        {value}
      </Text>
    </YStack>
  )
}
