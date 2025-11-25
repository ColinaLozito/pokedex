import { useToastController } from '@tamagui/toast'
import AutocompleteDropdownList from 'app/components/AutocompleteDropdown'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
import RecentSelections from 'app/components/RecentSelections'
import TypeGrid from 'app/components/TypeGrid'
import { useLoadingModal } from 'app/hooks/useLoadingModal'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { usePokemonGeneralStore } from 'app/store/pokemonGeneralStore'
import { NAVIGATION_DELAY } from 'app/utils/modalConstants'
import { setToastController } from 'app/utils/toast'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GetThemeValueForKey, H3, useTheme, YStack } from 'tamagui'

// Spacing constants for consistent layout
const SPACING = {
  SCREEN_PADDING_TOP: 50,
  SCREEN_PADDING_HORIZONTAL: 16,
  HEADER_TITLE_GAP: 24,
  SMALL_GAP: 10,
  MEDIUM_GAP: 20,
  LARGE_GAP: 40,
} as const

export default function KidScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const toast = useToastController()
  
  // Use data store for Pokemon details
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  
  // Local loading state for when fetching a new Pokemon
  const [isFetchingPokemon, setIsFetchingPokemon] = useState(false)
  const [pendingNavigationId, setPendingNavigationId] = useState<number | null>(null)
  
  // Use general store for lists, bookmarks, and preferences
  const pokemonList = usePokemonGeneralStore((state) => state.pokemonList)
  const bookmarkedPokemonIds = usePokemonGeneralStore((state) => state.bookmarkedPokemonIds)
  const recentSelections = usePokemonGeneralStore((state) => state.recentSelections)
  const removeRecentSelection = usePokemonGeneralStore((state) => state.removeRecentSelection)
  const addRecentSelection = usePokemonGeneralStore((state) => state.addRecentSelection)
  const typeList = usePokemonGeneralStore((state) => state.typeList)
  const toggleBookmark = usePokemonGeneralStore((state) => state.toggleBookmark)
  
  // Set toast controller for the store
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  const handleSelectItem = useCallback(async (id: number) => {
    // Validate ID
    if (!id || id === 0 || isNaN(id)) {
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }
    
    // Find the selected Pokémon in list
    const selectedPokemon = pokemonList.find((p) => p.id === id)

    // Check if Pokemon is already cached
    const isCached = getPokemonDetail(id) !== undefined

    // Only show loading if Pokemon is not cached (needs to be fetched)
    if (!isCached) {
      setIsFetchingPokemon(true)
    }

    // Fetch complete Pokemon details (uses cache if available)
    // This automatically sets currentPokemonId in the store
    try {
      await fetchPokemonDetail(id)
      // Only add to recent selections AFTER successful fetch
      if (selectedPokemon) {
        addRecentSelection(selectedPokemon)
      }
      
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
      // Error is already set in the store and toast is shown
      // Don't navigate or add to history if fetch failed
      setIsFetchingPokemon(false)
      setPendingNavigationId(null)
    } finally {
      // Clear loading state (this will trigger modal dismissal)
      if (!isCached) {
        setIsFetchingPokemon(false)
      }
    }
  }, [pokemonList, fetchPokemonDetail, addRecentSelection, router, toast, getPokemonDetail])

  const handleTypeSelect = useCallback((typeId: number, typeName: string) => {
    router.push({
      pathname: '/screens/typeFilter',
      params: {
        typeId: typeId.toString(),
        typeName: typeName,
      },
    })
  }, [router])

  const pokemonListDataSet = useMemo(() => 
    pokemonList.map((pokemon) => ({
      id: pokemon.id.toString(), 
      title: pokemon.name,
    })), [pokemonList]
  )

  const backgroundColor = useMemo(() => (
    theme.background?.val || '#FFFFFF'
  ) as GetThemeValueForKey<"backgroundColor">, [theme.background?.val])
  
  // Show loading modal when fetching a new Pokemon
  useLoadingModal(isFetchingPokemon, 'LOADING POKEMON')
  
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
  
  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
        <YStack
          flex={1}
          height="100%"
          width="100%"
          bg={backgroundColor}
          paddingTop={SPACING.SCREEN_PADDING_TOP}
          paddingHorizontal={SPACING.SCREEN_PADDING_HORIZONTAL}
        >
          <FlatList 
            data={null}
            renderItem={() => null}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <YStack paddingTop={insets.top}>
                <H3 color={theme.text.val}>Search for a Pokemon</H3>
                <YStack height={SPACING.HEADER_TITLE_GAP} />
                 <AutocompleteDropdownList
                  onSelectItem={handleSelectItem}
                  dataSet={pokemonListDataSet}
                />
                <YStack height={SPACING.SMALL_GAP} />
                <BookmarkedPokemon
                  bookmarkedPokemonIds={bookmarkedPokemonIds}
                  getPokemonDetail={getPokemonDetail}
                  getBasicPokemon={getBasicPokemon}
                  onRemove={toggleBookmark}
                  onSelect={handleSelectItem}
                  bookmarkSource="kid"
                />
                <YStack height={SPACING.MEDIUM_GAP} />
                <RecentSelections
                  recentSelections={recentSelections}
                  getPokemonDetail={getPokemonDetail}
                  getBasicPokemon={getBasicPokemon}
                  onRemove={removeRecentSelection}
                  onSelect={handleSelectItem}
                />
                <YStack height={SPACING.MEDIUM_GAP} />
                <TypeGrid
                  typeList={typeList}
                  onTypeSelect={handleTypeSelect}
                />
                <YStack height={SPACING.LARGE_GAP} />
              </YStack>
            }
          />
        </YStack>
    </AutocompleteDropdownContextProvider>
  )
}

