import PokemonCard from '@/shared/components/pokemon/PokemonCard'
import { PokemonCardVariant } from '@/shared/components/pokemon/PokemonCard/types'
import { transformPokemonToDisplayData } from '@/utils/pokemon/displayData'
import { Bookmark } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import { H4, XStack, YStack } from 'tamagui'
import type { BookmarkedPokemonProps } from '../home.types'

export default function BookmarkedPokemon({ 
   bookmarkedPokemonIds,
   getPokemonDetail,
   onRemove,
   onSelect
 }: BookmarkedPokemonProps) {
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
      <XStack gap="$2"  alignItems="center">
        <Bookmark size={20} color="$text" fill="$text" />
        <H4 color="$text">Bookmarked</H4>
      </XStack>
      <XStack flexWrap="wrap" justifyContent="space-between" gap="$2">
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
