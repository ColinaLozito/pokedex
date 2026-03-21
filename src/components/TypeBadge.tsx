import { pokemonTypeColors } from '@theme/colors'
import { Text, YStack } from 'tamagui'

interface TypeBadgeProps {
  typeName: string
  size?: 'small' | 'medium' | 'large'
}

const sizeStyles = {
  small: {
    px: '$3',
    py: '$2',
    borderRadius: '$1',
    fontSize: '$1',
  },
  medium: {
    px: '$3',
    py: '$2',
    borderRadius: '$2',
    fontSize: '$2',
  },
  large: {
    px: '$4',
    py: '$3',
    borderRadius: '$2',
    fontSize: '$3',
  },
} as const

export default function TypeBadge({ typeName, size = 'medium' }: TypeBadgeProps) {
  const typeColor = pokemonTypeColors[typeName]
  const styles = sizeStyles[size]

  return (
    <YStack
      elevation={1}
      bg={typeColor}
      px={styles.px}
      py={styles.py}
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
