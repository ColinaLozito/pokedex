import { Pressable } from 'react-native'
import { Image, Text, useTheme, YStack } from 'tamagui'

interface EvolutionSpriteContainerProps {
  sprite: string
  name: string
  id: number
  isCurrent: boolean
  onPress: () => void
  variant?: 'linear' | 'branching-initial' | 'branching-variant'
}

export default function EvolutionSpriteContainer({
  sprite,
  name,
  id,
  isCurrent,
  onPress,
  variant = 'linear',
}: EvolutionSpriteContainerProps) {
  const theme = useTheme()

  // Variant-specific configurations
  const config = {
    linear: {
      imageSize: 90,
      padding: 8,
      nameFontSize: 12,
      idFontSize: 14,
      nameMarginTop: 8,
      idMarginTop: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      minWidth: '20%',
      maxWidth: '100%',
    },
    'branching-initial': {
      imageSize: 90,
      padding: 12,
      nameFontSize: 14,
      idFontSize: 16,
      nameMarginTop: 12,
      idMarginTop: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      minWidth: undefined,
      maxWidth: undefined,
    },
    'branching-variant': {
      imageSize: 70,
      padding: 8,
      nameFontSize: 14,
      idFontSize: 14,
      nameMarginTop: 6,
      idMarginTop: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      minWidth: undefined,
      maxWidth: undefined,
    },
  }

  const variantConfig = config[variant]

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <YStack
        style={{
          alignItems: 'center',
          padding: variantConfig.padding,
          borderRadius: 12,
          backgroundColor: isCurrent ? variantConfig.backgroundColor : 'transparent',
          minWidth: variantConfig.minWidth,
          maxWidth: variantConfig.maxWidth,
          width: variant === 'branching-variant' ? '100%' : undefined,
        }}
      >
        <Image
          source={{ uri: sprite }}
          style={{
            width: variantConfig.imageSize,
            height: variantConfig.imageSize,
          }}
          resizeMode="contain"
        />
        <Text
          fontSize={variantConfig.nameFontSize}
          fontWeight="700"
          textTransform="capitalize"
          style={{
            marginTop: variantConfig.nameMarginTop,
            textAlign: 'center',
          }}
          color={theme.text.val}
        >
          {name}
        </Text>
        <Text
          fontSize={variantConfig.idFontSize}
          style={{ marginTop: variantConfig.idMarginTop }}
          color={theme.text.val}
        >
          #{id.toString().padStart(3, '0')}
        </Text>
      </YStack>
    </Pressable>
  )
}

