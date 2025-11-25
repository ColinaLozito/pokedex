import { useToastController } from '@tamagui/toast'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
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
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, H2, Text, YStack, useTheme } from 'tamagui'
import DailyPokemonCard from '../components/DailyPokemonCard'

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
  
  // Use individual selectors to avoid infinite loops (functions are stable)
  const setDailyPokemonId = useDailyPokemonStore((state) => state.setDailyPokemonId)
  const getRerollCount = useDailyPokemonStore((state) => state.getRerollCount)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const toggleParentBookmark = usePokemonGeneralStore((state) => state.toggleParentBookmark)
  const setRerollCount = useDailyPokemonStore((state) => state.setRerollCount)
  const parentBookmarkedPokemonIds = usePokemonGeneralStore(
    (state) => state.parentBookmarkedPokemonIds)
  
  // Show loading modal ONLY when user explicitly selects a Pokemon (via roulette)
  // NOT during initial load or when Pokemon is already cached
  useLoadingModal(
    loading && !!selectedPokemonId && !initialLoad, 
    'LOADING POKEMON', 
    [selectedPokemonId, initialLoad, loading]
  )
  
  // Set toast controller
  useEffect(() => {
    setToastController(toast)
    // Set initialLoad to false immediately since we're not auto-loading
    setInitialLoad(false)
  }, [toast])
  
  // Handle roulette completion
  const handleRouletteComplete = useCallback(async (finalNumber: number) => {
    // First, dismiss the roulette modal
    dismiss()
    
    // Wait a bit for the roulette modal to fully dismiss before showing loading
    await new Promise(resolve => setTimeout(resolve, 300))
    
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
    }
  }, [fetchPokemonDetail, setDailyPokemonId, toast, dismiss])
  
  // Start roulette
  const handleStartRoulette = useCallback(({ isInitialLoad }: { isInitialLoad?: boolean }) => {
    const newPokemonId = generateRandomPokemonId()
    const nextSession = rouletteSession + 1
    if (!isInitialLoad) {
      setRerollCount()
    }
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

  // Remove the renderPokemonCard callback entirely
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <ScrollView>
        <YStack flex={1} gap={16} p={16} pt={48}>
          {/* Header */}
          <H2 mb={16} color={theme.text.val}>
            Pokemon of the day
          </H2>
          
          {/* Pokemon Card - Shows "Get Pokemon" card when no Pokemon selected */}
          <DailyPokemonCard
            selectedPokemonId={selectedPokemonId}
            displayPokemon={displayPokemon || null}
            sprite={sprite}
            isBookmarked={bookmarked}
            isLoading={loading}
            isSpinning={isSpinning}
            onGetPokemon={() => handleStartRoulette({ isInitialLoad: true })}
            onPokemonPress={handlePokemonPress}
            onToggleBookmark={toggleParentBookmark}
          />
          
          {/* Retry Button - Always show when Pokemon is selected */}
          {selectedPokemonId && currentPokemon && (
            <Button
              onPress={() => handleStartRoulette({ isInitialLoad: false })}
              disabled={loading || isSpinning}
              color={theme.text.val}
              size={48}
              bordered
            >
              <Text textAlign="center" fontSize={16} fontWeight={800} color={theme.text.val}> 
                {loading ? 'Loading...' : 'Try Again'}
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
  )
}
