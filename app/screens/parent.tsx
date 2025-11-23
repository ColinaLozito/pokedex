import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, H2, Text, YStack, useTheme } from 'tamagui'
import { useRouter } from 'expo-router'
import { Bookmark, BookmarkCheck } from '@tamagui/lucide-icons'
import { usePokemonDataStore, setToastController } from 'app/store/pokemonDataStore'
import { useToastController } from '@tamagui/toast'
import PokemonCard from 'app/components/PokemonCard'
import NumberRoulette from 'app/components/NumberRoulette'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'

export default function ParentScreen() {
  const router = useRouter()
  const theme = useTheme()
  const toast = useToastController()
  
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRoulette, setShowRoulette] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  
  const getDailyPokemon = usePokemonDataStore((state) => state.getDailyPokemon)
  const setDailyPokemonId = usePokemonDataStore((state) => state.setDailyPokemonId)
  const getRerollCount = usePokemonDataStore((state) => state.getRerollCount)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const toggleParentBookmark = usePokemonDataStore((state) => state.toggleParentBookmark)
  const parentBookmarkedPokemonIds = usePokemonDataStore((state) => state.parentBookmarkedPokemonIds)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  
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
            console.log('[PARENT] Loaded daily Pokemon:', dailyId)
          } catch (error) {
            console.error('Failed to load daily Pokemon:', error)
          } finally {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Failed to get daily Pokemon:', error)
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
      console.error('Failed to fetch Pokemon:', error)
      toast.show('Error', { message: 'Failed to load Pokemon' })
    } finally {
      setLoading(false)
      setIsSpinning(false)
      setShowRoulette(false)
    }
  }
  
  // Start roulette
  const handleStartRoulette = () => {
    console.log('[PARENT] Starting roulette...')
    // Don't clear selectedPokemonId - keep current Pokemon visible during spin
    setShowRoulette(true)
    setIsSpinning(true)
    console.log('[PARENT] Roulette state:', { showRoulette: true, isSpinning: true })
  }
  
  // Handle Pokemon card press - navigate to details
  const handlePokemonPress = async (id: number) => {
    try {
      await fetchPokemonDetail(id)
      setCurrentPokemonId(id)
      router.push({
        pathname: '/screens/pokemonDetails',
        params: { source: 'parent' }
      })
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error)
    }
  }
  
  // Handle remove (not used, but required by PokemonCard)
  const handleRemove = () => {
    // No-op
  }
  
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
  const bookmarked = selectedPokemonId ? parentBookmarkedPokemonIds.includes(selectedPokemonId) : false
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <ScrollView>
        <YStack flex={1} style={{ padding: 16, gap: 16, paddingTop: 48 }}>
          {/* Header */}
          <H2 style={{ textAlign: 'center', marginBottom: 16 }} color={theme.text.val}>
            Pokemon of the day.
          </H2>
          
          {/* Number Roulette Card - Show when spinning */}
          {isSpinning && showRoulette && (
            <Card elevate bordered>
              <Card.Header padded>
                <YStack style={{ width: '100%', minHeight: 150 }}>
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
          {selectedPokemonId && currentPokemon && (
            <Card elevate backgroundColor={theme.red.val}>
              <Card.Header padded>
                <YStack style={{ gap: 12, alignItems: 'center', width: '100%', paddingTop: 24 }}>
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
                  <Button
                    size={68}
                    circular
                    elevate
                    icon={bookmarked ? BookmarkCheck : Bookmark}
                    onPress={() => toggleParentBookmark(selectedPokemonId)}
                    backgroundColor={"rgba(255, 255, 255, 0.3)"}
                    color={theme.text.val}
                  />
                </YStack>
              </Card.Header>
            </Card>
          )}
          
          {/* Start Roulette Button - Show only when no Pokemon selected and initial load is complete */}
          {!selectedPokemonId && !isSpinning && !initialLoad && (
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
                    backgroundColor={theme.water?.val}
                    color={theme.text.val}
                    width="100%"
                    height={68}
                  >
                    {loading ? 'Loading...' : 'Start Roulette'}
                  </Button>
                </YStack>
              </Card.Header>
            </Card>
          )}
          
          {/* Loading state during initial load */}
          {initialLoad && !selectedPokemonId && (
            <Card elevate bordered>
              <Card.Header padded>
                <YStack style={{ gap: 12, alignItems: 'center', width: '100%' }}>
                  <ActivityIndicator size="large" color={theme.color.val} />
                  <Text color={theme.text.val}>Loading...</Text>
                </YStack>
              </Card.Header>
            </Card>
          )}
          
          {/* Retry Button - Always show when Pokemon is selected */}
          {selectedPokemonId && currentPokemon && (
            <Button
              onPress={handleStartRoulette}
              disabled={loading || isSpinning}
              color={theme.text.val}
              size={48}
              bordered
            >
              {loading ? 'Loading...' : isSpinning ? 'Shuffling...' : 'Try Again'}
            </Button>
          )}
          
          {/* Reroll Count */}
          {rerollCount > 0 && (
            <Text fontSize={14} style={{ textAlign: 'center' }} color={theme.text.val}>
              Retries today: {rerollCount}
            </Text>
          )}
          
          {loading && selectedPokemonId && (
            <YStack style={{ alignItems: 'center', marginTop: 16 }}>
              <ActivityIndicator size="large" color={theme.color.val} />
              <Text style={{ marginTop: 8 }} color={theme.text.val}>Loading Pokemon...</Text>
            </YStack>
          )}
          
          {/* Parent Bookmarked Pokemon Section */}
          <BookmarkedPokemon variant="parent" onSelect={handlePokemonPress} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}
