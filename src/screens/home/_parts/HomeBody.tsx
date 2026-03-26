import { AutocompleteDropdown } from '@/components/common/AutocompleteDropdown'
import BookmarkedPokemon from '@/screens/home/_parts/BookmarkedPokemon'
import PokemonTypeGrid from '@/screens/home/_parts/PokemonTypeGrid'
import RecentSelections from '@/screens/home/_parts/RecentSelections'
import { H3, YStack } from 'tamagui'
import type { HomeBodyProps } from '../types'

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