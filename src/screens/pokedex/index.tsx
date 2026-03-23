import { useLoadingModal } from '@/hooks/useLoadingModal'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokedexBody from './_parts/PokedexBody'
import { usePokedexScreen } from './hooks/usePokedexScreen'

export default function PokedexScreen() {
  const insets = useSafeAreaInsets()

  const {
    pokemonListDataSet,
    bookmarkedPokemonIds,
    getPokemonDetail,
    toggleBookmark,
    recentSelections,
    removeRecentSelection,
    typeList,
    isLoading,
    handleSelect,
    handleTypeSelect,
  } = usePokedexScreen()

  useLoadingModal(isLoading, 'LOADING POKEMON')

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
              <PokedexBody
                pokemonListDataSet={pokemonListDataSet}
                bookmarkedPokemonIds={bookmarkedPokemonIds}
                getPokemonDetail={getPokemonDetail}
                toggleBookmark={toggleBookmark}
                recentSelections={recentSelections}
                removeRecentSelection={removeRecentSelection}
                onSelect={handleSelect}
                typeList={typeList}
                onTypeSelect={handleTypeSelect}
              />
            </YStack>
          }
        />
      </YStack>
    </AutocompleteDropdownContextProvider>
  )
}
