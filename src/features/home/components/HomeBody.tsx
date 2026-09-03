import { AutocompleteDropdown } from '@/shared/components/ui/atomic/AutocompleteDropdown'
import WhosThatPokemonText from 'assets/images/whos-that-pokemon-text.jpg'
import { router } from 'expo-router'
import { ImageBackground } from 'react-native'
import { H3, YStack } from 'tamagui'
import type { HomeBodyProps } from '../home.types'
import BookmarkedPokemon from './BookmarkedPokemon'
import PokemonTypeGrid from './PokemonTypeGrid'
import RecentSelections from './RecentSelections'


export default function HomeBody({
  bookmarkedPokemonIds,
  getPokemonDetail,
  toggleBookmark,
  recentSelections,
  removeRecentSelection,
  onSelect,
  typeList,
  onTypeSelect,
  onSearchChange,
  searchResults = [],
  isSearchLoading = false,
}: HomeBodyProps) {
  return (
    <YStack gap="$4">
      <YStack
        borderRadius="$4"
        overflow="hidden"
        height="$10"
        pressStyle={{ scale: 0.97 }}
        transition="medium"
        onPress={() => router.push('/whos-that-pokemon')}
      >
        <ImageBackground
          source={WhosThatPokemonText}
          style={{ flex: 1 }}
          resizeMode="cover"
        />
      </YStack>
      <YStack gap="$6">
        <H3 color="$text">Search for a Pokemon</H3>
        <AutocompleteDropdown
          onSelectItem={onSelect}
          onChangeText={onSearchChange}
          dataSet={searchResults}
          loading={isSearchLoading}
        />
      </YStack>

      <BookmarkedPokemon
        bookmarkedPokemonIds={bookmarkedPokemonIds}
        getPokemonDetail={getPokemonDetail}
        onRemove={toggleBookmark}
        onSelect={onSelect}
      />

      <RecentSelections
        recentSelections={recentSelections}
        getPokemonDetail={getPokemonDetail}
        onRemove={removeRecentSelection}
        onSelect={onSelect}
      />

      <PokemonTypeGrid
        typeList={typeList}
        onTypeSelect={onTypeSelect}
      />
    </YStack>
  )
}
