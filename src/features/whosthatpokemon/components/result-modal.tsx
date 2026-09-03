import { useModalStore } from '@/store/modalStore'
import type { WhosThatPokemonResultModalProps } from '@/store/types/modal'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Button, Text, YStack } from 'tamagui'

export default function WhosThatPokemonResultModal() {
  const { type, props, closeModal } = useModalStore()

  const data = useMemo(
    () => (type === 'whos-that-pokemon-result' ? (props as WhosThatPokemonResultModalProps) : null),
    [type, props],
  )

  if (!data) return null

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}
        locations={[0, 0.35]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <YStack flex={1} backgroundColor="transparent" zIndex={9999}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Image
            source={
              data.status === 'correct'
                ? require('assets/icons/misc/success.png')
                : require('assets/icons/misc/fail.png')
            }
            style={styles.resultImage}
            resizeMode="contain"
          />
        </YStack>
        <YStack height="15%" backgroundColor="white" justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Button
            onPress={closeModal}
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="black"
            paddingHorizontal="$8"
            width="100%"
            h="$8"
          >
            <Text color="black" fontWeight="$7" fontSize="$4">
              PLAY AGAIN
            </Text>
          </Button>
        </YStack>
      </YStack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  resultImage: { width: '100%', height: 300 },
})
