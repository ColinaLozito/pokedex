import { Pressable } from 'react-native'
import { GetThemeValueForKey, Image, Text, YStack } from 'tamagui'

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
  // Variant-specific configurations using tokens
  const config = {
    linear: {
      imageSize: 90, // Keep as hardcoded for specific sprite sizing
      padding: '$2',
      nameFontSize: '$1',
      idFontSize: '$2',
      nameMarginTop: '$2',
      idMarginTop: '$1',
      backgroundColor: '$opacity1',
      minWidth: '20%',
      maxWidth: '100%',
    },
    'branching-initial': {
      imageSize: 90, // Keep as hardcoded for specific sprite sizing
      padding: '$3',
      nameFontSize: '$2',
      idFontSize: '$3',
      nameMarginTop: '$3',
      idMarginTop: '$1',
      backgroundColor: '$opacity1',
      minWidth: undefined,
      maxWidth: undefined,
    },
    'branching-variant': {
      imageSize: 70, // Keep as hardcoded for specific sprite sizing
      padding: '$2',
      nameFontSize: '$2',
      idFontSize: '$2',
      nameMarginTop: '$1',
      idMarginTop: '$1',
      backgroundColor: '$opacity4',
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
        items="center"
        p={variantConfig.padding as GetThemeValueForKey<"padding">}
        borderRadius="$3"
        bg={isCurrent ? (variantConfig.backgroundColor as GetThemeValueForKey<"backgroundColor">) : undefined}
        width={variant === 'branching-variant' ? '100%' : undefined}
        style={{
          minWidth: variantConfig.minWidth,
          maxWidth: variantConfig.maxWidth,
        }}
      >
        <Image
          source={{ uri: sprite }}
          width={variantConfig.imageSize}
          height={variantConfig.imageSize}
          objectFit="contain"
        />
        <Text
          fontSize={variantConfig.nameFontSize as GetThemeValueForKey<"fontSize">}
          fontWeight="$7"
          textTransform="capitalize"
          mt={variantConfig.nameMarginTop as GetThemeValueForKey<"marginTop">}
          textAlign="center"
          color="$text"
        >
          {name}
        </Text>
        <Text
          fontSize={variantConfig.idFontSize as GetThemeValueForKey<"fontSize">}
          mt={variantConfig.idMarginTop as GetThemeValueForKey<"marginTop">}
          color="$text"
        >
          #{id.toString().padStart(3, '0')}
        </Text>
      </YStack>
    </Pressable>
  )
}

