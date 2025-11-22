import AutocompleteDropdownList from 'app/components/AutocompleteDropdown'
import RecentSelections from 'app/components/RecentSelections'
import { usePokemonStore } from 'app/store/pokemonStore'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { H3, useTheme, YStack } from 'tamagui'

export default function KidScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const pokemonList = usePokemonStore((state) => state.pokemonList)
  const addRecentSelection = usePokemonStore((state) => state.addRecentSelection)
  
  const handleSelectItem = (id: number) => {
    console.log('Selected item:', id)
    
    // Find the selected Pokémon and add to recent selections
    const selectedPokemon = pokemonList.find((p) => p.id === id)
    if (selectedPokemon) {
      addRecentSelection(selectedPokemon)
    }
  }

  const dataSet = pokemonList.map((pokemon) => ({
    id: pokemon.id.toString(),
    title: pokemon.name,
  }))
  
  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
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
            ListHeaderComponent={
              <YStack>
                <H3>Select a Pokemon</H3>
                <YStack height={10} />
                <AutocompleteDropdownList
                  onSelectItem={handleSelectItem}
                  dataSet={dataSet}
                />
                <YStack height={10} />
                <RecentSelections />
              </YStack>
            }
          />
        </YStack>
      </SafeAreaView>
    </AutocompleteDropdownContextProvider>
  )
}

