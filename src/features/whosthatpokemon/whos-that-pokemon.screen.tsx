import { useModalStore } from '@/store/modalStore'
import WhosThatPokemonText from 'assets/images/whos-that-pokemon-text-2.png'
import WhosThatPokemonBg from 'assets/images/whos-that-pokemon.png'
import { useEffect, useRef } from 'react'
import { Image, ImageBackground, StyleSheet } from 'react-native'
import { Card, Text, YStack } from 'tamagui'
import { SilhouetteSprite } from './components/silhouette-sprite'
import { RevealName } from './components/reveal-name'
import { OptionsGrid } from './components/options-grid'
import { useWhosThatPokemonScreen } from './hooks/use-whos-that-pokemon.screen'
import { SPRITE_SECTION_FLEX, TEXT_SECTION_FLEX, OPTIONS_SECTION_FLEX, WHOS_THAT_TEXT_IMAGE_SIZE } from './constants'

export default function WhosThatPokemonScreen() {
  const {
    spriteUrl,
    options,
    correctName,
    status,
    selectedOption,
    isLoading,
    error,
    handleSelect,
    handleNext,
    retry,
  } = useWhosThatPokemonScreen()

  const modalType = useModalStore((s) => s.type)
  const openModal = useModalStore((s) => s.openModal)

  const prevModalTypeRef = useRef(modalType)

  useEffect(() => {
    if (status !== 'playing') {
      openModal('whos-that-pokemon-result', { status, correctName })
    }
  }, [status, correctName, openModal])

  useEffect(() => {
    if (prevModalTypeRef.current === 'whos-that-pokemon-result' && modalType === null) {
      handleNext()
    }
    prevModalTypeRef.current = modalType
  }, [modalType, handleNext])

  if (isLoading) return null

  if (error) {
    return (
      <ImageBackground source={WhosThatPokemonBg} style={styles.screenBg} resizeMode="cover">
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$4">
          <Text color="white" fontSize="$5" fontWeight="$6" textAlign="center">
            Failed to load Pokémon
          </Text>
          <Card
            borderWidth={0}
            onPress={retry}
            pressStyle={{ scale: 0.95 }}
            transition="slow"
            elevation={5}
            backgroundColor="#f5f5f5"
            paddingHorizontal="$8"
            paddingVertical="$3"
          >
            <Card.Header>
              <Text color="$color12" fontSize="$4" fontWeight="$6">
                RETRY
              </Text>
            </Card.Header>
          </Card>
        </YStack>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground source={WhosThatPokemonBg} style={styles.screenBg} resizeMode="cover">
      <YStack flex={SPRITE_SECTION_FLEX} w="100%" mt="$12" justifyContent="center" alignItems="center">
        <RevealName name={correctName} visible={status !== 'playing'} />
        <SilhouetteSprite
          spriteUrl={spriteUrl}
          showSilhouette={status === 'playing'}
        />
      </YStack>

      <YStack flex={TEXT_SECTION_FLEX} justifyContent="center" alignItems="center">
        <Image
          source={WhosThatPokemonText}
          style={WHOS_THAT_TEXT_IMAGE_SIZE}
          resizeMode="contain"
        />
      </YStack>

      <YStack flex={OPTIONS_SECTION_FLEX} justifyContent="center" padding="$4" gap="$3">
        <OptionsGrid
          options={options}
          correctName={correctName}
          selectedOption={selectedOption}
          status={status}
          onSelect={handleSelect}
        />
      </YStack>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  screenBg: { flex: 1 },
})
