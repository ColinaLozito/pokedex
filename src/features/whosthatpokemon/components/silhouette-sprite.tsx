import { Image, StyleSheet } from 'react-native'
import { Square } from 'tamagui'

interface SilhouetteSpriteProps {
  spriteUrl: string
  showSilhouette: boolean
}

export function SilhouetteSprite({ spriteUrl, showSilhouette }: SilhouetteSpriteProps) {
  return (
    <Square
      w="$20"
      h="$20"
      transition="medium"
      enterStyle={{ scale: 0.5, opacity: 0 }}
      backgroundColor="transparent"
      overflow="hidden"
    >
      <Image
        source={{ uri: spriteUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />
      {showSilhouette && (
        <Image
          source={{ uri: spriteUrl }}
          style={[StyleSheet.absoluteFill, styles.tint]}
          resizeMode="contain"
        />
      )}
    </Square>
  )
}

const styles = StyleSheet.create({
  tint: { tintColor: 'black' },
})
