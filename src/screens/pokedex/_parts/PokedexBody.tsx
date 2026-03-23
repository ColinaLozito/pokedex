import { AutocompleteDropdown } from '@/components/common/AutocompleteDropdown'
import BookmarkedPokemon from '@/components/pokemon/BookmarkedPokemon'
import PokemonTypeGrid from '@/components/pokemon/PokemonTypeGrid'
import RecentSelections from '@/components/pokemon/RecentSelections'
import { H3, YStack } from 'tamagui'
import type { PokedexBodyProps } from '../types'

export default function PokedexBody({
  pokemonListDataSet,
  bookmarkedPokemonIds,
  getPokemonDetail,
  toggleBookmark,
  recentSelections,
  removeRecentSelection,
  onSelect,
  typeList,
  onTypeSelect,
}: PokedexBodyProps) {
  return (
    <YStack gap="$4">
      <YStack gap="$6">
        <H3 color="$text">Search for a Pokemon</H3>
        <AutocompleteDropdown
          onSelectItem={onSelect}
          dataSet={pokemonListDataSet}
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
