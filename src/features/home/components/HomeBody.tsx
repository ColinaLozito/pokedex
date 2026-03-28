import { AutocompleteDropdown } from '@/shared/components/ui/atomic/AutocompleteDropdown'
import BookmarkedPokemon from './BookmarkedPokemon'
import PokemonTypeGrid from './PokemonTypeGrid'
import RecentSelections from './RecentSelections'
import { H3, YStack } from 'tamagui'
import type { HomeBodyProps } from '../home.types'

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
