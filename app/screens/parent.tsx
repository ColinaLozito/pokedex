import { useToastController } from '@tamagui/toast'
import BookmarkButton from 'app/components/BookmarkButton'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
import LoadingScreen from 'app/components/LoadingScreen'
import NumberRoulette from 'app/components/NumberRoulette'
import PokemonCard from 'app/components/PokemonCard'
import { useDailyPokemonStore } from 'app/store/dailyPokemonStore'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { getPokemonSprite, getPokemonSpriteUrl } from 'app/utils/pokemonSprites'
import { setToastController } from 'app/utils/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ImageBackground, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, H2, Text, YStack, useTheme } from 'tamagui'
import PokeballWallpaper from '../../assets/images/pokeball-patten.png'

export default function ParentScreen() {
  const router = useRouter()
  const theme = useTheme()
  const toast = useToastController()
  
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRoulette, setShowRoulette] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  
  // Use individual selectors to avoid infinite loops (functions are stable)
  const getDailyPokemon = useDailyPokemonStore((state) => state.getDailyPokemon)
  const setDailyPokemonId = useDailyPokemonStore((state) => state.setDailyPokemonId)
  const getRerollCount = useDailyPokemonStore((state) => state.getRerollCount)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const toggleParentBookmark = usePokemonDataStore((state) => state.toggleParentBookmark)
  const parentBookmarkedPokemonIds = usePokemonDataStore(
    (state) => state.parentBookmarkedPokemonIds)
  
  // Set toast controller
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  // Load daily Pokemon on mount if it exists
  useEffect(() => {
    const loadDailyPokemon = async () => {
      try {
        setInitialLoad(true)
        // Get or generate daily Pokemon
        const dailyId = await getDailyPokemon()
        
        // If we have a daily Pokemon for today, load and display it
        if (dailyId) {
          try {
            setLoading(true)
            await fetchPokemonDetail(dailyId)
            setSelectedPokemonId(dailyId)
          } catch (error) {
            // Error is handled by the store
          } finally {
            setLoading(false)
          }
        }
      } catch (error) {
        // Error is handled by the store
      } finally {
        setInitialLoad(false)
      }
    }
    
    loadDailyPokemon()
  }, [getDailyPokemon, fetchPokemonDetail])
  
  // Handle roulette completion
  const handleRouletteComplete = async (finalNumber: number) => {
    try {
      setLoading(true)
      setSelectedPokemonId(finalNumber)
      
      // Fetch Pokemon details
      await fetchPokemonDetail(finalNumber)
      
      // Update daily Pokemon to this number (increments reroll count)
      setDailyPokemonId(finalNumber)
      
      toast.show('Pokemon Selected!', { message: `You got Pokemon #${String(finalNumber).padStart(4, '0')}!` })
    } catch (error) {
      toast.show('Error', { message: 'Failed to load Pokemon' })
    } finally {
      setLoading(false)
      setIsSpinning(false)
      setShowRoulette(false)
    }
  }
  
  // Start roulette
  const handleStartRoulette = useCallback(() => {
    // Don't clear selectedPokemonId - keep current Pokemon visible during spin
    setShowRoulette(true)
    setIsSpinning(true)
  }, [])
  
  
  // Handle remove (not used, but required by PokemonCard)
  const handleRemove = useCallback(() => {
    // No-op
  }, [])

  // Handle Pokemon card press - navigate to details
  const handlePokemonPress = useCallback(
    async (id: number) => {
      try {
        // Fetch Pokemon details - automatically sets currentPokemonId
        await fetchPokemonDetail(id)
        router.push({
          pathname: '/screens/pokemonDetails',
          params: { source: 'parent' },
        })
      } catch (error) {
        // Error is handled by the store
      }
    },
    [fetchPokemonDetail, router],
  )

  // Render "Ready to spin?" card
  const renderStartRouletteCard = useCallback(() => {
    return (
      <Card elevate bordered background={theme.red.val}>
        <Card.Header padded>
          <YStack style={{ gap: 12, alignItems: 'center', width: '100%' }}>
            <Text fontSize={16} style={{ textAlign: 'center' }} color={theme.text.val}>
              Ready to spin?
            </Text>
            <Button
              onPress={handleStartRoulette}
              disabled={loading || isSpinning}
              size={68}
              style={{ backgroundColor: theme.water?.val }}
              color={theme.text.val}
              width="100%"
              height={68}
            >
              {loading ? 'Spinning...' : 'Start Roulette'}
            </Button>
          </YStack>
        </Card.Header>
      </Card>
    )
  }, [theme.red.val, theme.text.val, theme.water?.val, handleStartRoulette, loading, isSpinning])

  
  const currentPokemon = selectedPokemonId ? getPokemonDetail(selectedPokemonId) : null
  const rerollCount = getRerollCount()
  
  // Get sprite
  const getSprite = () => {
    if (!currentPokemon || !selectedPokemonId) return null
    const basicData = getBasicPokemon(selectedPokemonId)
    return getPokemonSprite(currentPokemon, selectedPokemonId) || 
           (basicData ? getPokemonSprite(basicData, selectedPokemonId) : 
            getPokemonSpriteUrl(selectedPokemonId))
  }
  
  const sprite = getSprite()
  // Make bookmark state reactive by subscribing to the array directly
  const bookmarked =
    selectedPokemonId
      ? parentBookmarkedPokemonIds.includes(selectedPokemonId)
      : false

  // Render Pokemon Card section
  const renderPokemonCard = useCallback(() => {
    if (!currentPokemon || !selectedPokemonId) return null

    return (
      <Card elevate>
        <Card.Header padded>
          <ImageBackground
            source={PokeballWallpaper}
            imageStyle={{
              width: '100%',
              height: 'auto',
              overflow: 'hidden',
              borderRadius: 16,
            }}
            style={{
              width: '100%',
              height: 'auto',
              overflow: 'hidden',
              borderRadius: 16,
            }}
          >
            <YStack
              style={{
                gap: 12,
                alignItems: 'center',
                width: '100%',
                paddingTop: 24,
              }}
            >
              <YStack style={{ width: '70%' }}>
                <PokemonCard
                  id={currentPokemon.id}
                  name={currentPokemon.name}
                  sprite={sprite}
                  variant="recent"
                  primaryType={currentPokemon.types[0]?.type.name}
                  types={currentPokemon.types}
                  onRemove={handleRemove}
                  onSelect={handlePokemonPress}
                  displayRemoveButton={false}
                  bookmarkSource="parent"
                />
              </YStack>

              {/* Bookmark Button */}
              <BookmarkButton
                isBookmarked={bookmarked}
                onPress={() => toggleParentBookmark(selectedPokemonId)}
                size={68}
                backgroundColor="rgba(255, 255, 255, 0.3)"
              />
            </YStack>
          </ImageBackground>
        </Card.Header>
      </Card>
    )
  }, [
    currentPokemon,
    selectedPokemonId,
    sprite,
    bookmarked,
    handleRemove,
    handlePokemonPress,
    toggleParentBookmark,
  ])

  // Show full-screen loading during initial load
  if (initialLoad && !selectedPokemonId) {
    return <LoadingScreen message="Loading..." />
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <ScrollView>
        <YStack flex={1} gap={16} p={16} pt={48}>
          {/* Header */}
          <H2 mb={16} color={theme.text.val}>
            {`Pokemon 
            of the day`}
          </H2>
          
          {/* Number Roulette Card - Show when spinning */}
          {isSpinning && showRoulette && (
            <Card elevate bordered>
              <Card.Header padded>
                <YStack width="100%" minH={150}>
                  <NumberRoulette
                    key={`roulette-${isSpinning}-${showRoulette}-${Date.now()}`} // Force re-render on state change
                    onComplete={handleRouletteComplete}
                    duration={3000}
                    min={1}
                    max={1000}
                    start={true}
                  />
                </YStack>
              </Card.Header>
            </Card>
          )}
          
          {/* Pokemon Card - Show when Pokemon is selected */}
          {selectedPokemonId && currentPokemon && renderPokemonCard()}
          
          {/* Start Roulette Button - Show only when no Pokemon selected and initial load is complete */}
          {!selectedPokemonId && !isSpinning && !initialLoad && renderStartRouletteCard()}
          
          {/* Retry Button - Always show when Pokemon is selected */}
          {selectedPokemonId && currentPokemon && (
            <Button
              onPress={handleStartRoulette}
              disabled={loading || isSpinning}
              color={theme.text.val}
              size={48}
              bordered
            >
              <Text textAlign="center" fontSize={16} fontWeight={800}> 
                {loading ? 'Loading...' : isSpinning ? 'Shuffling...' : 'Try Again'}
              </Text>
             
            </Button>
          )}
          
          {/* Reroll Count */}
          {rerollCount > 0 && (
            <Text fontSize={14} textAlign="center" color={theme.text.val}>
              Retries today: {rerollCount}
            </Text>
          )}
          
          {loading && selectedPokemonId && (
            <YStack alignItems="center" mt={16}>
              <ActivityIndicator size="large" color={theme.color.val} />
              <Text mt={8} color={theme.text.val}>Loading Pokemon...</Text>
            </YStack>
          )}
          
          {/* Parent Bookmarked Pokemon Section */}
          <BookmarkedPokemon
            bookmarkedPokemonIds={parentBookmarkedPokemonIds}
            getPokemonDetail={getPokemonDetail}
            getBasicPokemon={getBasicPokemon}
            onRemove={toggleParentBookmark}
            onSelect={handlePokemonPress}
            bookmarkSource="parent"
          />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}
