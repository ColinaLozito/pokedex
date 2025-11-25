import { FlashList } from '@shopify/flash-list'
import { useToastController } from '@tamagui/toast'
import ErrorScreen from 'app/components/ErrorScreen'
import PokemonCard from 'app/components/PokemonCard'
import { useLoadingModal } from 'app/hooks/useLoadingModal'
import type { PokemonListItem } from 'app/services/types'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { usePokemonGeneralStore } from 'app/store/pokemonGeneralStore'
import { NAVIGATION_DELAY } from 'app/utils/modalConstants'
import { setToastController } from 'app/utils/toast'
import typeSymbolsIcons from 'app/utils/typeSymbolsIcons'
import { pokemonTypeColors } from 'config/colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { H2, Image, XStack, YStack } from 'tamagui'

// No-op function for onRemove when remove button is not displayed
const NO_OP = () => {}

export default function TypeFilterScreen() {
  const router = useRouter()
  const toast = useToastController()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()
  
  const [filteredList, setFilteredList] = useState<PokemonListItem[]>([])
  const [error, setError] = useState<string | null>(null)
  // Add these new states for Pokemon selection loading
  const [isFetchingPokemon, setIsFetchingPokemon] = useState(false)
  const [pendingNavigationId, setPendingNavigationId] = useState<number | null>(null)
  
  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeName = params.typeName || 'Unknown'

  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const fetchPokemonByTypeAndGetDisplayData = usePokemonGeneralStore(
    (state) => state.fetchPokemonByTypeAndGetDisplayData
  )
  const getPokemonDisplayData = usePokemonGeneralStore((state) => state.getPokemonDisplayData)

  // Subscribe to store changes to trigger re-renders when Pokemon data is updated
  // This ensures cards update when returning from pokemonDetails screen
  // Note: Subscribing to entire objects - useMemo will handle optimization
  const pokemonDetails = usePokemonDataStore((state) => state.pokemonDetails)
  const basicPokemonCache = usePokemonDataStore((state) => state.basicPokemonCache)
  
  const addRecentSelection = usePokemonGeneralStore((state) => state.addRecentSelection)
  
  // Show loading modal only when fetching individual Pokemon, not for initial list load
  useLoadingModal(isFetchingPokemon, 'LOADING POKEMON', [isFetchingPokemon])
  
  // Navigate to pokemon details after loading modal dismisses
  useEffect(() => {
    if (!isFetchingPokemon && pendingNavigationId !== null) {
      // Wait a bit for modal to fully dismiss before navigating
      const timer = setTimeout(() => {
        router.push({
          pathname: '/screens/pokemonDetails',
          params: { source: 'kid' }
        })
        setPendingNavigationId(null)
      }, NAVIGATION_DELAY)
      
      return () => clearTimeout(timer)
    }
  }, [isFetchingPokemon, pendingNavigationId, router])
  
  // Set toast controller
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  // Fetch Pokemon by type (just the filtered list)
  useEffect(() => {
    const loadPokemon = async () => {
      if (!typeId) {
        setError('Invalid type ID')
        return
      }
      
      try {
        setError(null)
        const data = await fetchPokemonByTypeAndGetDisplayData(typeId, typeName)
        // Store the filtered list for reactivity
        setFilteredList(data.map((item) => ({ id: item.id, name: item.name })))
      } catch (_err) {
        setError('Failed to load Pokemon')
        toast.show('Error', { message: 'Failed to load Pokemon for this type' })
      } 
    }
    
    loadPokemon()
  }, [typeId, typeName, fetchPokemonByTypeAndGetDisplayData, toast])
  
  // Re-compute display data reactively when store cache updates
  // We include pokemonDetails and basicPokemonCache to trigger re-computation
  // when store updates, since getPokemonDisplayData reads from store internally
  const pokemonData = useMemo(() => {
    if (filteredList.length === 0) return []
    return getPokemonDisplayData(filteredList, typeName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredList, typeName, getPokemonDisplayData, pokemonDetails, basicPokemonCache])
  
  // Handle Pokemon card selection
  const handlePokemonSelect = useCallback(async (id: number) => {
    const selectedPokemon = filteredList.find((p) => p.id === id)
    
    if (!selectedPokemon) {
      return
    }
    
    // Check if Pokemon is already cached
    const isCached = getPokemonDetail(id) !== undefined

    // Only show loading if Pokemon is not cached (needs to be fetched)
    if (!isCached) {
      setIsFetchingPokemon(true)
    }
    
    try {
      // Fetch Pokemon details - automatically sets currentPokemonId
      await fetchPokemonDetail(id)
      addRecentSelection(selectedPokemon)
      
      // If loading modal was shown, wait for it to dismiss before navigating
      if (!isCached) {
        setPendingNavigationId(id)
      } else {
        // If cached, navigate immediately
        router.push({
          pathname: '/screens/pokemonDetails',
          params: { source: 'kid' }
        })
      }
    } catch (_error) {
      // Error is handled by the store
      setIsFetchingPokemon(false)
      setPendingNavigationId(null)
    } finally {
      // Clear loading state (this will trigger modal dismissal)
      if (!isCached) {
        setIsFetchingPokemon(false)
      }
    }
  }, [filteredList, fetchPokemonDetail, addRecentSelection, router, getPokemonDetail])
  
  // Get type color (memoized)
  const typeColor = useMemo(() => 
    pokemonTypeColors[typeName.toLowerCase() as keyof typeof pokemonTypeColors] || '#A8A77A',
    [typeName]
  )
  
  // Get type symbol icon (memoized)
  const typeIcon = useMemo(() => 
    typeSymbolsIcons[typeName.toLowerCase() as keyof typeof typeSymbolsIcons],
    [typeName]
  )
  
  if (error) {
    return (
      <ErrorScreen
        error={error}
        onGoBack={() => router.back()}
        backgroundColor={typeColor}
        errorColor="white"
        goBackColor="white"
      />
    )
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: typeColor }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack 
          gap={12}
          items="center"
          px={16}
          pb={12}
        >
          <XStack flex={1} items="center" justify="center">
            <H2 
              color="white" 
              textTransform="capitalize"
              fontWeight={800}
            >
              {typeName}
            </H2>
            {typeIcon && (
              <Image
                source={typeIcon}
                position="absolute"
                right={-90}
                width={200}
                height={200}
                zIndex={-1}
                objectFit="contain"
              />
            )}
          </XStack>
        </XStack>
        
        {/* Pokemon Grid */}
        <YStack 
          flex={1} 
          bg="white"
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          mt={8}
          pt={16}
          px={8}
        >
          <FlashList
            data={pokemonData}
            numColumns={2}
            renderItem={({ item }) => (
              <YStack p={4}>
                <PokemonCard
                  id={item.id}
                  name={item.name}
                  sprite={item.sprite}
                  variant="recent"
                  primaryType={item.primaryType}
                  types={item.types}
                  onRemove={NO_OP}
                  onSelect={handlePokemonSelect}
                  displayRemoveButton={false}
                />
              </YStack>
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <YStack height={8} />}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}

