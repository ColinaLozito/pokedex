import { useToastController } from '@tamagui/toast'
import BookmarkButton from 'app/components/BookmarkButton'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
import PokemonCard from 'app/components/PokemonCard'
import { useLoadingModal } from 'app/hooks/useLoadingModal'
import { useModal } from 'app/hooks/useModal'
import { useDailyPokemonStore } from 'app/store/dailyPokemonStore'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { usePokemonGeneralStore } from 'app/store/pokemonGeneralStore'
import { generateRandomPokemonId } from 'app/utils/dateUtils'
import { getPokemonSprite, getPokemonSpriteUrl } from 'app/utils/pokemonSprites'
import { setToastController } from 'app/utils/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ImageBackground, ScrollView } from 'react-native'
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
  const [initialLoad, setInitialLoad] = useState(true)
  const [rouletteSession, setRouletteSession] = useState(0)
  const { showRoulette, dismiss } = useModal()
  // Keep previous Pokemon data to show while loading new one
  const previousPokemonRef = useRef<ReturnType<typeof getPokemonDetail> | null>(null)
  
  // Show loading modal when fetching Pokemon
  useLoadingModal(loading && !!selectedPokemonId, 'LOADING POKEMON', [selectedPokemonId])
  
  // Use individual selectors to avoid infinite loops (functions are stable)
  const getDailyPokemon = useDailyPokemonStore((state) => state.getDailyPokemon)
  const setDailyPokemonId = useDailyPokemonStore((state) => state.setDailyPokemonId)
  const getRerollCount = useDailyPokemonStore((state) => state.getRerollCount)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const toggleParentBookmark = usePokemonGeneralStore((state) => state.toggleParentBookmark)
  const parentBookmarkedPokemonIds = usePokemonGeneralStore(
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
          } catch (_error) {
            // Error is handled by the store
          } finally {
            setLoading(false)
          }
        }
      } catch (_error) {
        // Error is handled by the store
      } finally {
        setInitialLoad(false)
      }
    }
    
    loadDailyPokemon()
  }, [getDailyPokemon, fetchPokemonDetail])
  
  // Handle roulette completion
  const handleRouletteComplete = useCallback(async (finalNumber: number) => {
    try {
      setLoading(true)
      setSelectedPokemonId(finalNumber)
      
      // Fetch Pokemon details
      await fetchPokemonDetail(finalNumber)
      
      // Update daily Pokemon to this number (increments reroll count)
      setDailyPokemonId(finalNumber)
      
      toast.show('Pokemon Selected!', { message: `You got Pokemon #${String(finalNumber).padStart(4, '0')}!` })
    } catch (_error) {
      toast.show('Error', { message: 'Failed to load Pokemon' })
    } finally {
      setLoading(false)
      setIsSpinning(false)
      dismiss()
    }
  }, [fetchPokemonDetail, setDailyPokemonId, toast, dismiss])
  
  // Start roulette
  const handleStartRoulette = useCallback(() => {
    const newPokemonId = generateRandomPokemonId()
    const nextSession = rouletteSession + 1
    setRouletteSession(nextSession)
    setIsSpinning(true)
    showRoulette({
      sessionKey: nextSession,
      finalNumber: newPokemonId,
      duration: 3000,
      min: 1,
      max: 1000,
      onComplete: handleRouletteComplete,
    })
  }, [rouletteSession, showRoulette, handleRouletteComplete])
  
  
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
      } catch (_error) {
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
          <YStack gap={12} items='center' width='100%'>
            <Text fontSize={16} textAlign='center' color={theme.text.val}>
              Ready to spin?
            </Text>
            <Button
              onPress={handleStartRoulette}
              disabled={loading || isSpinning}
              size={68}
              backgroundColor={theme.water?.val}
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
  
  // Update previous Pokemon ref when currentPokemon changes
  useEffect(() => {
    if (currentPokemon) {
      previousPokemonRef.current = currentPokemon
    }
  }, [currentPokemon])
  
  // Use current Pokemon if available, otherwise use previous one (for smooth transition)
  const displayPokemon = currentPokemon || previousPokemonRef.current
  
  // Get sprite (memoized to avoid recalculation)
  const sprite = useMemo(() => {
    if (!displayPokemon || !selectedPokemonId) return null
    const basicData = getBasicPokemon(selectedPokemonId)
    return getPokemonSprite(displayPokemon, selectedPokemonId) || 
           (basicData ? getPokemonSprite(basicData, selectedPokemonId) : 
            getPokemonSpriteUrl(selectedPokemonId))
  }, [displayPokemon, selectedPokemonId, getBasicPokemon])
  
  // Make bookmark state reactive by subscribing to the array directly (memoized)
  const bookmarked = useMemo(() =>
    selectedPokemonId
      ? parentBookmarkedPokemonIds.includes(selectedPokemonId)
      : false,
    [selectedPokemonId, parentBookmarkedPokemonIds]
  )

  // Render Pokemon Card section - always render container when selectedPokemonId exists
  const renderPokemonCard = useCallback(() => {
    // Always render container if selectedPokemonId exists, even if Pokemon is loading
    if (!selectedPokemonId) return null
    
    // If no Pokemon data available yet (first load), don't render
    if (!displayPokemon) return null

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
              gap={12}
              items='center'
              width='100%'
              paddingTop={24}
            >
              <YStack width='70%'>
                <PokemonCard
                  id={displayPokemon.id}
                  name={displayPokemon.name}
                  sprite={sprite}
                  variant="recent"
                  primaryType={displayPokemon.types?.[0]?.type.name || 'normal'}
                  types={displayPokemon.types || []}
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
    selectedPokemonId,
    displayPokemon,
    sprite,
    bookmarked,
    handleRemove,
    handlePokemonPress,
    toggleParentBookmark,
  ])

  // Show full-screen loading during initial load
  useLoadingModal(initialLoad && !selectedPokemonId, 'LOADING', [selectedPokemonId])

  if (initialLoad && !selectedPokemonId) {
    return null
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
        <ScrollView>
          <YStack flex={1} gap={16} p={16} pt={48}>
          {/* Header */}
          <H2 mb={16} color={theme.text.val}>
            Pokemon of the day
          </H2>
          
          {/* Pokemon Card - Always show container when Pokemon is selected */}
          {selectedPokemonId && renderPokemonCard()}
          
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
    </>
  )
}
