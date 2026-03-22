import { usePokemonSelection } from '@/hooks/usePokemonSelection'
import { useLoadingModal } from '@/hooks/useLoadingModal'
import { usePokemonDataStore } from '@/store/pokemonDataStore'
import { usePokemonGeneralStore } from '@/store/pokemonGeneralStore'
import { useRouter } from 'expo-router'
import { FlatList } from 'react-native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GetThemeValueForKey, YStack } from 'tamagui'
import { useMemo } from 'react'
import PokedexBody from './_parts/PokedexBody'

export default function PokedexScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const pokemonList = usePokemonGeneralStore((state) => state.pokemonList)
  const addRecentSelection = usePokemonGeneralStore((state) => state.addRecentSelection)
  const bookmarkedPokemonIds = usePokemonGeneralStore((state) => state.bookmarkedPokemonIds)
  const recentSelections = usePokemonGeneralStore((state) => state.recentSelections)
  const removeRecentSelection = usePokemonGeneralStore((state) => state.removeRecentSelection)
  const typeList = usePokemonGeneralStore((state) => state.typeList)
  const toggleBookmark = usePokemonGeneralStore((state) => state.toggleBookmark)

  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)

  const pokemonListDataSet = useMemo(() =>
    pokemonList.map((pokemon) => ({
      id: pokemon.id.toString(),
      title: pokemon.name,
    })), [pokemonList]
  )

  const { isLoading, handleSelect } = usePokemonSelection({
    pokemonList,
    addRecentSelection,
    fetchPokemonDetail,
    getPokemonDetail,
    pokemonListDataSet,
  })

  useLoadingModal(isLoading, 'LOADING POKEMON')

  const handleTypeSelect = (typeId: number, typeName: string) => {
    router.push({
      pathname: '/typeFilter',
      params: {
        typeId: typeId.toString(),
        typeName: typeName,
      },
    })
  }

  const backgroundColor = '$background' as GetThemeValueForKey<"backgroundColor">

  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <YStack
        flex={1}
        height="100%"
        width="100%"
        bg={backgroundColor}
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
