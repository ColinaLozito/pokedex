import { ImageBackground } from 'react-native'
import { Image, XStack, YStack } from 'tamagui'
import PokedexLogo from "../../assets/images/pokedex-logo.png"
import PokedexWallpaper from "../../assets/images/pokedex-wallpaper.jpg"
import { ActionButton } from '../components/ActionButton'

import { router } from 'expo-router'

export default function HomeScreen() {
  return (
    <ImageBackground 
      source={PokedexWallpaper} 
      style={{ flex: 1 }}
      objectFit="cover"
    >
      <YStack flex={1} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <YStack width={"100%"} height={90} style={{ position: "absolute", top: "35%" }}>
          <Image
            source={PokedexLogo}
            style={{
              width: 256,
              height: 84,
              alignSelf: 'center',
            }}
          />
        </YStack>
        <XStack style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 68 }}>
          <ActionButton
            text="Parent"
            onPress={() => router.push('/screens/parent')}
          />
          <ActionButton
            text="Kid"
            onPress={() => router.push('/screens/kid')}
          />
        </XStack>
      </YStack>
    </ImageBackground>
  )
}