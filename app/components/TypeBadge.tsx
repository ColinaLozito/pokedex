import { Text, YStack } from 'tamagui'
import { pokemonTypeColors } from 'config/colors'

interface TypeBadgeProps {
  typeName: string
  size?: 'small' | 'medium' | 'large'
}

export default function TypeBadge({ typeName, size = 'medium' }: TypeBadgeProps) {
  const typeColor = pokemonTypeColors[typeName as keyof typeof pokemonTypeColors] || '#CCCCCC'
  
  // Size variants
  const sizeStyles = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: '$2' as const,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      fontSize: '$3' as const,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      fontSize: '$4' as const,
    },
  }
  
  const styles = sizeStyles[size]
  
  return (
    <YStack
      elevation={1}
      style={{
        backgroundColor: typeColor,
        paddingHorizontal: styles.paddingHorizontal,
        paddingVertical: styles.paddingVertical,
        borderRadius: styles.borderRadius,
      }}
    >
      <Text 
        color="white" 
        fontWeight="600" 
        fontSize={styles.fontSize}
        textTransform="capitalize"
      >
        {typeName}
      </Text>
    </YStack>
  )
}

