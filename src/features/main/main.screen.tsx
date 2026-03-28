import { ActionButton } from '@/shared/components/ui/atomic/ActionButton'
import { useClearData } from '@/shared/hooks/useClearData'
import { Trash2 } from '@tamagui/lucide-icons'
import { size } from '@theme/space'
import PokedexLogo from "assets/images/pokedex-logo.png"
import PokedexWallpaper from "assets/images/pokedex-wallpaper.jpg"
import { router } from 'expo-router'
import { ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Image, XStack, YStack } from 'tamagui'

export default function MainScreen() {
  const insets = useSafeAreaInsets()
  const { hasStoredData, handleClearData } = useClearData()

  return (
    <ImageBackground 
      source={PokedexWallpaper} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <YStack flex={1} justifyContent='flex-end' alignItems='flex-end'>
        {hasStoredData && (
          <YStack position="absolute" top={insets.top + size[4]} right="$4" zIndex={10}>
            <Button
              onPress={handleClearData}
              size="$7"
              circular
              backgroundColor="$opacity2"
              pressStyle={{ scale: 0.9 }}
              icon={Trash2}
            />
          </YStack>
        )}

        <YStack width="100%" height="$9" position="absolute" top="35%">
          <Image
            source={PokedexLogo}
            width="$19"
            height="$8"
            alignSelf='center'
          />
        </YStack>
        <XStack 
          width='100%' 
          alignItems='center' 
          justifyContent='center' 
          gap="$6" 
          marginBottom="$11"
        >
           <ActionButton
             text="ENTER"
              onPress={() => router.push('/home')}
           />
         </XStack>
      </YStack>
    </ImageBackground>
  )
}
