import BookmarkButton from 'app/components/BookmarkButton'
import EmptyStateScreen from 'app/components/EmptyStateScreen'
import ErrorScreen from 'app/components/ErrorScreen'
import EvolutionChain from 'app/components/EvolutionChain'
import LoadingScreen from 'app/components/LoadingScreen'
import PokemonAbilities from 'app/components/PokemonAbilities'
import PokemonAttributes from 'app/components/PokemonAttributes'
import PokemonBaseStats from 'app/components/PokemonBaseStats'
import TypeChips from 'app/components/TypeChips'
import { useCurrentPokemon } from 'app/store/hooks/usePokemonData'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { pokemonTypeColors } from 'config/colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { H2, Image, Text, XStack, YStack, useTheme } from 'tamagui'

export default function PokemonDetailsScreen() {
  const theme = useTheme()
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const params = useLocalSearchParams<{ source?: 'parent' | 'kid' }>()
  
  const { currentPokemon } = useCurrentPokemon()

  // Use individual selectors to avoid infinite loops
  const loading = usePokemonDataStore((state) => state.loading)
  const error = usePokemonDataStore((state) => state.error)
  const clearError = usePokemonDataStore((state) => state.clearError)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const currentPokemonId = usePokemonDataStore((state) => state.currentPokemonId)
  
  // Determine bookmark system based on source (default to 'kid' if not specified)
  const bookmarkSource = params.source || 'kid'
  const toggleBookmark = usePokemonDataStore((state) => 
    bookmarkSource === 'parent' ? state.toggleParentBookmark : state.toggleBookmark
  )
  const bookmarkedPokemonIds = usePokemonDataStore((state) => 
    bookmarkSource === 'parent' ? state.parentBookmarkedPokemonIds : state.bookmarkedPokemonIds
  )
  
  // Check if current Pokemon is bookmarked (reactive)
  const isBookmarked = currentPokemon ? bookmarkedPokemonIds.includes(currentPokemon.id) : false
  
  // Clear error when component mounts or when navigating back
  useEffect(() => {
    return () => {
      // Clear error when leaving the screen
      clearError()
    }
  }, [clearError])

  // Scroll to top when Pokemon changes
  useEffect(() => {
    if (currentPokemonId && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
  }, [currentPokemonId])

  // Handle evolution Pokemon press - update current Pokemon in same screen
  const handleEvolutionPress = async (pokemonId: number) => {
    // Don't do anything if it's already the current Pokemon
    if (pokemonId === currentPokemonId) {
      return
    }
    
    try {
      // Fetch the Pokemon details - automatically sets currentPokemonId
      // This will trigger re-render and scroll to top via the useEffect that watches currentPokemonId
      await fetchPokemonDetail(pokemonId)
    } catch (error) {
      console.error('Failed to fetch evolution Pokemon details:', error)
      // Error toast is already shown by the store
    }
  }

  // Get type color for background
  const getPrimaryTypeColor = () => {
    if (!currentPokemon || currentPokemon.types.length === 0) {
      return theme.background.val
    }
    const primaryType = currentPokemon.types[0].type.name
    return pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors] || theme.background.val
  }

  // Render Pokemon header (name and ID)
  const renderPokemonHeader = useCallback(() => {
    if (!currentPokemon) return null

    return (
      <XStack
        width="100%"
        justify="space-between"
        items="center"
        marginBottom={16}
      >
        <H2
          color="white"
          textTransform="capitalize"
          fontSize={32}
          fontWeight="800"
        >
          {currentPokemon.name}
        </H2>
        <Text
          color="rgba(255, 255, 255, 0.9)"
          fontSize={18}
          fontWeight="600"
        >
          #{currentPokemon.id.toString().padStart(3, '0')}
        </Text>
      </XStack>
    )
  }, [currentPokemon])

  // Render header section with Pokemon image
  const renderHeaderSection = useCallback(() => {
    if (!currentPokemon) return null

    // Calculate values inside callback to avoid dependency issues
    const primaryTypeColor =
      currentPokemon.types.length > 0
        ? pokemonTypeColors[
            currentPokemon.types[0].type.name as keyof typeof pokemonTypeColors
          ] || theme.background.val
        : theme.background.val

    const sprite =
      currentPokemon.sprites.other?.['official-artwork']?.front_default ||
      currentPokemon.sprites.other?.home?.front_default ||
      currentPokemon.sprites.front_default

    return (
      <YStack
        bg={theme.background.val as any}
        paddingHorizontal={16}
        paddingTop={60}
        items="center"
      >
        {/* Background Circle */}
        <XStack
          position="absolute"
          top={-650}
          left={-300}
          zIndex={0}
          borderRadius={1000}
          width={1000}
          height={1000}
          bg={primaryTypeColor as any}
          opacity={0.9}
        />
        {/* Name and Number - Top */}
        {renderPokemonHeader()}

        {/* Large Pokemon Image */}
        {sprite && (
          <Image
            source={{ uri: sprite }}
            style={{
              width: 250,
              height: 250,
            }}
            objectFit="contain"
          />
        )}
        <BookmarkButton
          isBookmarked={isBookmarked}
          onPress={() => toggleBookmark(currentPokemon.id)}
          size={40}
          scaleIcon={1.5}
          opacity={0.6}
          position="absolute"
          right={16}
          bottom={200}
        />
      </YStack>
    )
  }, [
    currentPokemon,
    theme.background.val,
    isBookmarked,
    toggleBookmark,
    renderPokemonHeader,
  ])

  // Loading state
  if (loading) {
    return <LoadingScreen message="Loading Pokémon..." />
  }

  // Error state - Only show if there's an error AND no current Pokemon
  // This prevents the error screen from blocking the UI after a failed fetch
  if (error && !currentPokemon) {
    return (
      <ErrorScreen
        error={error}
        onGoBack={() => router.back()}
      />
    )
  }

  // No data state
  if (!currentPokemon) {
    return (
      <EmptyStateScreen
        title="No Pokémon data available"
        subtitle="Please select a Pokémon first"
      />
    )
  }

  return (
    <YStack flex={1} bg={getPrimaryTypeColor() as any}>
      <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: theme.background.val }}>
        <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1}>
          {/* Header Section with Pokemon Image */}
          {renderHeaderSection()}

          {/* Details Section - White Background */}
          <YStack 
            bg="white"
            marginTop={0}
            gap={8}
          >
            {/* Types */}
            <XStack justify="center" items="center">
              <TypeChips types={currentPokemon.types} size="medium" gap={8} />
            </XStack>

            {/* Attributes: Species, Height, Weight */}
            <PokemonAttributes
              species={currentPokemon.speciesInfo?.genus}
              height={currentPokemon.height}
              weight={currentPokemon.weight}
            />

            {/* Evolution Chain */}
            {currentPokemon.evolutionChain && currentPokemon.evolutionChain.length > 1 && (
              currentPokemon.evolutionChainTree ? (
                <YStack>
                  <EvolutionChain
                    evolutionChainTree={currentPokemon.evolutionChainTree}
                    currentPokemonId={currentPokemon.id}
                    onPokemonPress={handleEvolutionPress}
                    getBasicPokemon={getBasicPokemon}
                  />
                </YStack>
              ) : (
                <></>
              )
            )}

            {/* Base Stats */}
            <PokemonBaseStats
              stats={currentPokemon.stats}
              primaryTypeColor={getPrimaryTypeColor()}
            />

            {/* Abilities */}
            <PokemonAbilities abilities={currentPokemon.abilities} />
          </YStack>
        </YStack>
        </SafeAreaView>
      </ScrollView>
    </YStack>
  )
}
