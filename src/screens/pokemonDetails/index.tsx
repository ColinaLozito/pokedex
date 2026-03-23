import { baseColors } from '@theme/colors'
import ErrorScreen from '@/components/common/ErrorScreen'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetThemeValueForKey, YStack } from 'tamagui'
import PokemonDetailsContent from './_parts/PokemonDetailsContent'
import PokemonDetailsEmptyState from './_parts/PokemonDetailsEmptyState'
import PokemonDetailsHeader from './_parts/PokemonDetailsHeader'
import { usePokemonDetailsScreen } from './hooks/usePokemonDetailsScreen'

export default function PokemonDetailsScreen() {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)

  const { pokemon, theme, status, handlers, actions } =
    usePokemonDetailsScreen()

  useLoadingModal(status.loading, 'Loading Pokémon...')

  useEffect(() => {
    return () => {
      actions.clearError()
    }
  }, [actions.clearError])

  useEffect(() => {
    if (pokemon.currentPokemon && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
  }, [pokemon.currentPokemon?.id])

  if (status.error && !pokemon.currentPokemon) {
    return (
      <ErrorScreen error={status.error} onGoBack={() => router.back()} />
    )
  }

  if (!pokemon.currentPokemon) {
    return <PokemonDetailsEmptyState />
  }

  return (
    <YStack
      flex={1}
      bg={theme.primaryTypeColor as GetThemeValueForKey<'backgroundColor'>}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: baseColors.white }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <YStack flex={1}>
            <PokemonDetailsHeader
              pokemon={pokemon.currentPokemon}
              isBookmarked={pokemon.isBookmarked}
              onBookmarkPress={handlers.handleBookmarkPress}
              primaryTypeColor={theme.primaryTypeColor}
            />

            <PokemonDetailsContent
              pokemon={pokemon.currentPokemon}
              primaryTypeColor={theme.primaryTypeColor}
              onEvolutionPress={handlers.handleEvolutionPress}
              getPokemonDetail={actions.getPokemonDetail}
            />
          </YStack>
        </SafeAreaView>
      </ScrollView>
    </YStack>
  )
}
