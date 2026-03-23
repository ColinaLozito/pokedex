import PokemonCard from '@/components/pokemon/PokemonCard'
import { Bookmark } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import { PokemonCardVariant } from 'src/types/pokemonCardVariant'
import { transformPokemonToDisplayData } from 'src/utils/transformPokemon'
import { H4, XStack, YStack } from 'tamagui'
import { BookmarkedPokemonProps } from './types'

export default function BookmarkedPokemon({ 
   bookmarkedPokemonIds,
   getPokemonDetail,
   onRemove,
   onSelect
 }: BookmarkedPokemonProps) {
  // Get Pokemon data for each bookmarked ID
  // Must be called before early return to follow Rules of Hooks
  const bookmarkedPokemonData = useMemo(() => {
    return bookmarkedPokemonIds.map((id) => 
      transformPokemonToDisplayData(
        id,
        `Pokemon #${id}`,
        getPokemonDetail
      )
    )
  }, [bookmarkedPokemonIds, getPokemonDetail])

  if (bookmarkedPokemonIds.length === 0) {
    return null
  }

  return (
    <YStack gap="$3">
      <XStack gap="$2" items="center">
        <Bookmark size={20} color="$text" fill="$text" />
        <H4 color="$text">Bookmarked</H4>
      </XStack>
      <XStack flexWrap="wrap" justify="space-between" gap="$2">
        {bookmarkedPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} width="48%">
             <PokemonCard
               id={pokemon.id}
               name={pokemon.name}
               sprite={pokemon.sprite}
               variant={PokemonCardVariant.BOOKMARK}
               primaryType={pokemon.primaryType}
               types={pokemon.types}
               onRemove={onRemove}
               onSelect={onSelect}
             />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
