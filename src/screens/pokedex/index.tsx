import { useLoadingModal } from '@/hooks/useLoadingModal'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import PokedexBody from './_parts/PokedexBody'
import { usePokedexScreen } from './hooks/usePokedexScreen'

export default function PokedexScreen() {
  const insets = useSafeAreaInsets()

  const { data, actions } = usePokedexScreen()

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
              <PokedexBody
                pokemonListDataSet={data.pokemonListDataSet}
                bookmarkedPokemonIds={data.bookmarkedPokemonIds}
                getPokemonDetail={actions.getPokemonDetail}
                toggleBookmark={actions.toggleBookmark}
                recentSelections={data.recentSelections}
                removeRecentSelection={actions.removeRecentSelection}
                onSelect={actions.handleSelect}
                typeList={data.typeList}
                onTypeSelect={actions.handleTypeSelect}
              />
            </YStack>
          }
        />
      </YStack>
    </AutocompleteDropdownContextProvider>
  )
}
