import { YStack, Image } from 'tamagui'
import { ActionButton } from '../components/ActionButton'
import PokedexLogo from "../../assets/images/pokedex-logo.png"
import PokeballImage from "../../assets/images/pokeball-image.png"
import { router } from 'expo-router'

export default function HomeScreen() {
  return (
    <YStack flex={1} style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <YStack width={"100%"} height={90} style={{ position: "absolute", top: 72 }}>
        <Image
          source={PokedexLogo}
          style={{
            width: 256,
            height: 84,
            alignSelf: 'center',
          }}
        />
      </YStack>
      <YStack style={{ width: '100%', alignItems: 'center', flexDirection: 'column', gap: 24 }}>
        <ActionButton
          text="Parent"
          onPress={() => router.push('/screens/parent')}
        />
        <ActionButton
          text="Kid"
          onPress={() => router.push('/screens/kid')}
        />
      </YStack>
      <YStack width={"100%"} style={{ position: "absolute", bottom: -20 }}>
        <Image
          source={PokeballImage}
          style={{
            width: 256,
            height: 250,
            alignSelf: 'center',
          }}
        />
      </YStack>
    </YStack>
  )
}