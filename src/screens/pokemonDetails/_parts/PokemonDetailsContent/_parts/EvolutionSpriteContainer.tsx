import { evolutionSpriteVariantStyleConfig } from '@/screens/pokemonDetails/constants'
import { EvolutionSpriteContainerProps } from '@/screens/pokemonDetails/types'
import { Pressable } from 'react-native'
import { GetThemeValueForKey, Image, Text, YStack } from 'tamagui'

export default function EvolutionSpriteContainer({
  sprite,
  name,
  id,
  isCurrent,
  onPress,
  variant = 'linear',
}: EvolutionSpriteContainerProps) {
  const variantConfig = evolutionSpriteVariantStyleConfig[variant]

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
