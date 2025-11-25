import { Trash2 } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Image, useTheme, XStack, YStack } from 'tamagui'
import PokedexLogo from "../../assets/images/pokedex-logo.png"
import PokedexWallpaper from "../../assets/images/pokedex-wallpaper.jpg"
import { ActionButton } from '../components/ActionButton'
import { useClearData } from '../hooks/useClearData'

export default function HomeScreen() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { hasStoredData, handleClearData } = useClearData()

  return (
    <ImageBackground 
      source={PokedexWallpaper} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <YStack flex={1} justifyContent='flex-end' alignItems='flex-end'>
        {/* Clear Data Button - Top Right */}
        {hasStoredData && (
          <YStack position="absolute" top={insets.top + 16} right={16} zIndex={10}>
            <Button
              onPress={handleClearData}
              size={64}
              circular
              backgroundColor={'rgba(0, 0, 0, 0.1)'}
              pressStyle={{ scale: 0.9 }}
              icon={Trash2}
            />
          </YStack>
        )}

        <YStack width="100%" height={90} position="absolute" top="35%">
          <Image
            source={PokedexLogo}
            width={256}
            height={84}
            alignSelf='center'
          />
        </YStack>
        <XStack width='100%' alignItems='center' justifyContent='center' gap={24} marginBottom={68}>
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