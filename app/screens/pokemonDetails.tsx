import { usePokemonDataStore, useCurrentPokemon } from 'app/store/pokemonDataStore'
import { pokemonTypeColors } from 'config/colors'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, H2, Text, XStack, YStack, useTheme } from 'tamagui'
import { useRouter } from 'expo-router'
import { Bookmark, ChevronLeft, BookmarkCheck } from '@tamagui/lucide-icons'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'
import TypeChips from 'app/components/TypeChips'
import EvolutionChain from 'app/components/EvolutionChain'
import PokemonAttributes from 'app/components/PokemonAttributes'
import PokemonBaseStats from 'app/components/PokemonBaseStats'
import PokemonAbilities from 'app/components/PokemonAbilities'

export default function PokemonDetailsScreen() {
  const theme = useTheme()
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const { currentPokemon } = useCurrentPokemon()
  const loading = usePokemonDataStore((state) => state.loading)
  const error = usePokemonDataStore((state) => state.error)
  const clearError = usePokemonDataStore((state) => state.clearError)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  const currentPokemonId = usePokemonDataStore((state) => state.currentPokemonId)
  const toggleBookmark = usePokemonDataStore((state) => state.toggleBookmark)
  const bookmarkedPokemonIds = usePokemonDataStore((state) => state.bookmarkedPokemonIds)
  
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
    console.log(`[EVOLUTION PRESS] Switching to Pokemon ID: ${pokemonId}`)
    
    // Don't do anything if it's already the current Pokemon
    if (pokemonId === currentPokemonId) {
      console.log('[EVOLUTION PRESS] Already viewing this Pokemon')
      return
    }
    
    try {
      // Fetch the Pokemon details (uses cache if available)
      await fetchPokemonDetail(pokemonId)
      // Set as current Pokemon - this will trigger re-render and scroll to top
      setCurrentPokemonId(pokemonId)
      console.log(`[EVOLUTION PRESS] Successfully switched to Pokemon ID: ${pokemonId}`)
    } catch (error) {
      console.error('Failed to fetch evolution Pokemon details:', error)
      // Error toast is already shown by the store
    }
  }

  // Helper function to get sprite for evolution Pokemon
  // Uses direct URL (no fetch needed) or cached data if available
  const getEvolutionSprite = (pokemonId: number): string => {
    const basicPokemon = getBasicPokemon(pokemonId)
    
    // If we have cached data, use it; otherwise use direct URL
    if (basicPokemon) {
      return getPokemonSprite(basicPokemon, pokemonId)
    }
    
    // Direct URL - no fetch needed!
    return getPokemonSpriteUrl(pokemonId)
  }

  // Debug: Log current Pokemon data
  if (currentPokemon) {
    console.log('[DETAIL SCREEN] Current Pokemon:', currentPokemon.name)
    console.log('[DETAIL SCREEN] Evolution Chain:', JSON.stringify(currentPokemon.evolutionChain, null, 2))
    
    // Check store for each evolution
    currentPokemon.evolutionChain?.forEach((evo, index) => {
      const cachedPokemon = getBasicPokemon(evo.id)
      console.log(`[DETAIL SCREEN] Evolution ${index + 1} - ${evo.name}:`, {
        id: evo.id,
        inStore: !!cachedPokemon,
        sprite: cachedPokemon ? getEvolutionSprite(evo.id) : 'NOT IN STORE'
      })
    })
  }

  // Get the best available sprite
  const getMainSprite = () => {
    if (!currentPokemon) return null
    
    return (
      currentPokemon.sprites.other?.['official-artwork']?.front_default ||
      currentPokemon.sprites.other?.home?.front_default ||
      currentPokemon.sprites.front_default
    )
  }

  // Get type color for background
  const getPrimaryTypeColor = () => {
    if (!currentPokemon || currentPokemon.types.length === 0) {
      return theme.background.val
    }
    const primaryType = currentPokemon.types[0].type.name
    return pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors] || theme.background.val
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
        <YStack flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.color.val} />
          <Text style={{ marginTop: 16 }} color={theme.text.val}>Loading Pokémon...</Text>
        </YStack>
      </SafeAreaView>
    )
  }

  // Error state - Only show if there's an error AND no current Pokemon
  // This prevents the error screen from blocking the UI after a failed fetch
  if (error && !currentPokemon) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
        <YStack flex={1} style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text fontSize={20} style={{ color: theme.red10?.val || '#EF4444', textAlign: 'center' }}>
            {error}
          </Text>
          <YStack style={{ height: 20 }} />
          <Text 
            fontSize={16} 
            style={{ color: theme.blue10?.val || '#3B82F6', textDecorationLine: 'underline' }}
            onPress={() => router.back()}
          >
            ← Go Back
          </Text>
        </YStack>
      </SafeAreaView>
    )
  }

  // No data state
  if (!currentPokemon) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
        <YStack flex={1} style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text fontSize={20} style={{ textAlign: 'center' }} color={theme.text.val}>
            No Pokémon data available
          </Text>
          <Text fontSize={14} style={{ color: theme.gray10?.val || '#737373', marginTop: 8 }}>
            Please select a Pokémon first
          </Text>
        </YStack>
      </SafeAreaView>
    )
  }

  const mainSprite = getMainSprite()

  console.log("mainSprite", mainSprite)

  return (
    <YStack flex={1} style={{ backgroundColor: getPrimaryTypeColor() }}>
      <XStack 
        position="absolute" 
        style={{ 
            top: 48, 
            right: 0,
            paddingHorizontal: 16,
            zIndex: 10000, 
            justifyContent: 'space-between', 
            alignItems: 'center', gap: 8,
            width: '100%',
      }}
      >
        {/* Back Button */}
        <Button
          size={40}
          circular
          onPress={() => router.back()}
          icon={ChevronLeft}
          color={theme.text.val}
          scaleIcon={1.7}
          elevate
          shadowColor={theme.shadowColor?.val as any || 'rgba(0, 0, 0, 0.1)'}
          shadowOpacity={0.3}
          shadowRadius={8}
          opacity={0.6}
        />

        {/* Bookmark Button */}
        <Button
          size={40}
          circular
          onPress={() => toggleBookmark(currentPokemon.id)}
          icon={isBookmarked ? BookmarkCheck : Bookmark}
          color={theme.text.val}
          scaleIcon={1.5}
          elevate
          shadowColor={theme.shadowColor?.val as any || 'rgba(0, 0, 0, 0.1)'}
          shadowOpacity={0.3}
          shadowRadius={8}
          opacity={0.6}
        />
      </XStack>

      <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: theme.background.val }}>
        <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1}>
          {/* Header Section with Pokemon Image */}
          <YStack
            style={{
              backgroundColor: theme.background.val,
              paddingHorizontal: 16,
              paddingTop: 60,
              alignItems: 'center',
            }}
          >
            {/* Background Circle */}
            <XStack 
             style={{
              position: 'absolute',
              top: -650,
              left: -300,
              zIndex: 0,
              backgroundColor: getPrimaryTypeColor(),
              borderRadius: 1000,
              width: 1000,
              height: 1000,
             }}
            />
            {/* Name and Number - Top */}
            <XStack 
              width="100%" 
              style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
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
            
            {/* Large Pokemon Image */}
            {mainSprite && (
              <Image
                source={{ uri: mainSprite }}
                style={{
                  width: 250,
                  height: 250,
                }}
                resizeMode="contain"
              />
            )}
          </YStack>

          {/* Details Section - White Background */}
          <YStack 
            style={{ 
              backgroundColor: 'white',
              marginTop: 0,
              gap: 8,
            }}
          >
            {/* Types */}
            <XStack style={{ justifyContent: 'center', alignItems: 'center' }}>
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
