import { useLoadingModal } from '@/shared/hooks/useLoadingModal'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import HomeBody from './components/HomeBody'
import { useHomeScreen } from './hooks/use-home.screen'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()

  const { data, actions } = useHomeScreen()

  useLoadingModal(false, 'LOADING POKEMON')

  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <YStack
        flex={1}
        height="100%"
        width="100%"
        bg={'$background'}
        paddingTop="$12"
        paddingHorizontal="$4"
      >
        <FlatList
          data={null}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <YStack paddingTop={insets.top}>
              <HomeBody
                pokemonListDataSet={data.pokemonListDataSet}
                bookmarkedPokemonIds={data.bookmarkedPokemonIds}
                getPokemonDetail={actions.getPokemonDetail}
                toggleBookmark={actions.toggleBookmark}
                recentSelections={data.recentSelections}
                removeRecentSelection={actions.removeRecentSelection}
                onSelect={actions.handleSelect}
                typeList={data.typeList}
                onTypeSelect={actions.handleTypeSelect}
                onSearchChange={actions.onSearchChange}
                searchResults={data.searchResults}
                isSearchLoading={data.isSearchLoading}
              />
            </YStack>
          }
        />
      </YStack>
    </AutocompleteDropdownContextProvider>
  )
}
