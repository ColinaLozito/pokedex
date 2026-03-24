import { pokemonTypeColors } from '@theme/colors'
import { Text, YStack } from 'tamagui'
import { typeBadgeSizeStyles } from './constant'
import { TypeBadgeProps } from './types'

export default function TypeBadge({ typeName, size = 'medium' }: TypeBadgeProps) {
  const typeColor = pokemonTypeColors[typeName]
  const styles = typeBadgeSizeStyles[size]

  return (
    <YStack
      elevation={1}
      bg={typeColor}
      p={styles.p}
      borderRadius={styles.borderRadius}
      alignSelf="flex-start"
    >
      <Text
        color="$white"
        fontWeight="$6"
        fontSize={styles.fontSize}
        textTransform="capitalize"
      >
        {typeName}
      </Text>
    </YStack>
  )
}
