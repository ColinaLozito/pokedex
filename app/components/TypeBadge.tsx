import { pokemonTypeColors } from 'config/colors'
import { GetThemeValueForKey, Text, YStack } from 'tamagui'

interface TypeBadgeProps {
  typeName: string
  size?: 'small' | 'medium' | 'large'
}

export default function TypeBadge({ typeName, size = 'medium' }: TypeBadgeProps) {
  const typeColor = (
    pokemonTypeColors[typeName as keyof typeof pokemonTypeColors] || '#CCCCCC'
  ) as GetThemeValueForKey<"backgroundColor">
  
  // Size variants
  const sizeStyles = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: 14,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      fontSize: 16,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      fontSize: 20,
    },
  }
  
  const styles = sizeStyles[size]
  
  return (
    <YStack
      elevation={1}
      bg={typeColor}
      px={styles.paddingHorizontal}
      py={styles.paddingVertical}
      borderRadius={styles.borderRadius}
      alignSelf="flex-start"
    >
      <Text 
        color="white" 
        fontWeight={600} 
        fontSize={styles.fontSize}
        textTransform="capitalize"
      >
        {typeName}
      </Text>
    </YStack>
  )
}

