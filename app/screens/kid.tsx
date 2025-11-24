import AutocompleteDropdownList from 'app/components/AutocompleteDropdown'
import RecentSelections from 'app/components/RecentSelections'
import BookmarkedPokemon from 'app/components/BookmarkedPokemon'
import TypeGrid from 'app/components/TypeGrid'
import { usePokemonStore } from 'app/store/pokemonStore'
import { usePokemonDataStore, setToastController } from 'app/store/pokemonDataStore'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { H3, useTheme, YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

export default function KidScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const toast = useToastController()
  
  // Use new data store for Pokemon list and details
  // Use individual selectors to avoid infinite loops (functions are stable, state values trigger re-renders)
  const pokemonList = usePokemonDataStore((state) => state.pokemonList)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const bookmarkedPokemonIds = usePokemonDataStore((state) => state.bookmarkedPokemonIds)
  
  // Keep recent selections in old store for now
  const recentSelections = usePokemonStore((state) => state.recentSelections)
  const removeRecentSelection = usePokemonStore((state) => state.removeRecentSelection)
  const addRecentSelection = usePokemonStore((state) => state.addRecentSelection)
  const typeList = usePokemonStore((state) => state.typeList)
  
  const toggleBookmark = usePokemonDataStore((state) => state.toggleBookmark)
  
  // Set toast controller for the store
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  const handleSelectItem = async (id: number) => {
    // Validate ID
    if (!id || id === 0 || isNaN(id)) {
      console.error('Invalid Pokemon ID received:', id)
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }
    
    // Find the selected Pokémon in list
    const selectedPokemon = pokemonList.find((p) => p.id === id)

    // Fetch complete Pokemon details (uses cache if available)
    try {
      await fetchPokemonDetail(id)
      
      // Only add to recent selections AFTER successful fetch
      if (selectedPokemon) {
        addRecentSelection(selectedPokemon)
      }
      
      setCurrentPokemonId(id)
      
      // Navigate to details screen
      router.push({
        pathname: '/screens/pokemonDetails',
        params: { source: 'kid' }
      })
    } catch (error) {
      console.error('Failed to fetch Pokémon details:', error)
      // Error is already set in the store and toast is shown
      // Don't navigate or add to history if fetch failed
    }
  }

  const handleTypeSelect = (typeId: number, typeName: string) => {
    router.push({
      pathname: '/screens/typeFilter',
      params: {
        typeId: typeId.toString(),
        typeName: typeName,
      },
    })
  }

  const dataSet = pokemonList.map((pokemon) => ({
          id: pokemon.id.toString(), 
    title: pokemon.name,
  }))
  
  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
        <YStack
          flex={1}
          height="100%"
          width="100%"
          bg="$background"
          style={{
            paddingTop: 50,
            paddingHorizontal: 16,
          }}
        >
          <FlatList 
            data={null}
            renderItem={() => null}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <YStack style={{ paddingTop: insets.top }}>
                <H3 color={theme.text.val}>Search for a Pokemon</H3>
                <YStack height={24} />
                 <AutocompleteDropdownList
                  onSelectItem={handleSelectItem}
                  dataSet={dataSet}
                />
                <YStack height={10} />
                <BookmarkedPokemon
                  bookmarkedPokemonIds={bookmarkedPokemonIds}
                  getPokemonDetail={getPokemonDetail}
                  getBasicPokemon={getBasicPokemon}
                  onRemove={toggleBookmark}
                  onSelect={handleSelectItem}
                  bookmarkSource="kid"
                />
                <YStack height={20} />
                <RecentSelections
                  recentSelections={recentSelections}
                  getPokemonDetail={getPokemonDetail}
                  getBasicPokemon={getBasicPokemon}
                  onRemove={removeRecentSelection}
                  onSelect={handleSelectItem}
                />
                <YStack height={20} />
                <TypeGrid
                  typeList={typeList}
                  onTypeSelect={handleTypeSelect}
                />
                <YStack height={40} />
              </YStack>
            }
          />
        </YStack>
    </AutocompleteDropdownContextProvider>
  )
}

