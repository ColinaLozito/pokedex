import ErrorScreen from '@/components/common/ErrorScreen'
import { baseColors } from '@theme/colors'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetThemeValueForKey, YStack } from 'tamagui'
import PokemonDetailsContent from './components/PokemonDetailsContent'
import PokemonDetailsEmptyState from './components/PokemonDetailsEmptyState'
import PokemonDetailsHeader from './components/PokemonDetailsHeader'
import { usePokemonDetailsScreen } from './hooks/use-pokemon-details.screen'

export default function PokemonDetailsScreen() {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)

  const { data, status, actions } = usePokemonDetailsScreen()

  useEffect(() => {
    return () => {
      actions.clearError()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.clearError])

  useEffect(() => {
    if (data.currentPokemon && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.currentPokemon?.id])

  if (status.error && !data.currentPokemon) {
    return (
      <ErrorScreen error={status.error} onGoBack={() => router.back()} />
    )
  }

  if (!data.currentPokemon) {
    return <PokemonDetailsEmptyState />
  }

  return (
    <YStack
      flex={1}
      bg={data.primaryTypeColor as GetThemeValueForKey<'backgroundColor'>}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: baseColors.white }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <YStack flex={1}>
            <PokemonDetailsHeader
              pokemon={data.currentPokemon}
              isBookmarked={data.isBookmarked}
              onBookmarkPress={actions.handleBookmarkPress}
              primaryTypeColor={data.primaryTypeColor}
            />

            <PokemonDetailsContent
              pokemon={data.currentPokemon}
              primaryTypeColor={data.primaryTypeColor}
              onEvolutionPress={actions.handleEvolutionPress}
              getPokemonDetail={actions.getPokemonDetail}
            />
          </YStack>
        </SafeAreaView>
      </ScrollView>
    </YStack>
  )
}
