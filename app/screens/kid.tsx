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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { H3, useTheme, YStack } from 'tamagui'
import { useToastController } from '@tamagui/toast'

export default function KidScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const toast = useToastController()
  
  // Use new data store for Pokemon list and details
  const pokemonList = usePokemonDataStore((state) => state.pokemonList)
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  
  // Keep recent selections in old store for now
  const addRecentSelection = usePokemonStore((state) => state.addRecentSelection)
  
  // Set toast controller for the store
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  const handleSelectItem = async (id: number) => {
    console.log('=== HANDLE SELECT ITEM ===')
    console.log('Selected Pokemon ID:', id)
    console.log('Type of ID:', typeof id)
    
    // Validate ID
    if (!id || id === 0 || isNaN(id)) {
      console.error('Invalid Pokemon ID received:', id)
      toast.show('Invalid Selection', { message: 'Please select a valid Pokemon' })
      return
    }
    
    // Find the selected Pokémon in list
    const selectedPokemon = pokemonList.find((p) => p.id === id)
    console.log('Found Pokemon in list:', selectedPokemon)

    // Fetch complete Pokemon details (uses cache if available)
    try {
      console.log(`Attempting to fetch Pokemon ID: ${id}`)
      await fetchPokemonDetail(id)
      
      // Only add to recent selections AFTER successful fetch
      if (selectedPokemon) {
        console.log('Fetch successful, adding to recent selections')
        addRecentSelection(selectedPokemon)
      }
      
      setCurrentPokemonId(id)
      
      // Navigate to details screen
      router.push('/screens/pokemonDetails')
    } catch (error) {
      console.error('Failed to fetch Pokémon details:', error)
      // Error is already set in the store and toast is shown
      // Don't navigate or add to history if fetch failed
    }
  }

  const handleTypeSelect = (typeId: number, typeName: string) => {
    console.log('Type selected:', typeName, 'with ID:', typeId)
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
                <H3>Select a Pokemon</H3>
                <YStack height={10} />
                <AutocompleteDropdownList
                  onSelectItem={handleSelectItem}
                  dataSet={dataSet}
                />
                <YStack height={10} />
                <BookmarkedPokemon />
                <YStack height={20} />
                <RecentSelections />
                <YStack height={20} />
                <TypeGrid onTypeSelect={handleTypeSelect} />
              </YStack>
            }
          />
        </YStack>
    </AutocompleteDropdownContextProvider>
  )
}

