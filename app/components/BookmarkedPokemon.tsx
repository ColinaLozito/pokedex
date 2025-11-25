import { Bookmark } from '@tamagui/lucide-icons'
import type { CombinedPokemonDetail, PokemonDetail } from 'app/services/types'
import { transformPokemonToDisplayData } from 'app/utils/pokemonDisplayData'
import { useMemo } from 'react'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'

interface BookmarkedPokemonProps {
  bookmarkedPokemonIds: number[]
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  getBasicPokemon: (id: number) => PokemonDetail | undefined
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
  bookmarkSource?: 'parent' | 'kid' // Source for bookmark system when navigating
}

export default function BookmarkedPokemon({ 
  bookmarkedPokemonIds,
  getPokemonDetail,
  getBasicPokemon,
  onRemove,
  onSelect,
  bookmarkSource = 'kid'
}: BookmarkedPokemonProps) {
  const theme = useTheme()
  
  // Get Pokemon data for each bookmarked ID
  // Must be called before early return to follow Rules of Hooks
  const bookmarkedPokemonData = useMemo(() => {
    return bookmarkedPokemonIds.map((id) => 
      transformPokemonToDisplayData(
        id,
        `Pokemon #${id}`,
        getPokemonDetail,
        getBasicPokemon
      )
    )
  }, [bookmarkedPokemonIds, getPokemonDetail, getBasicPokemon])

  if (bookmarkedPokemonIds.length === 0) {
    return null
  }

  return (
    <YStack gap={12}>
      <XStack gap={8} items='center'>
        <Bookmark size={20} color={theme.text.val} fill={theme.text.val} />
        <H4 color={theme.text.val}>Bookmarked</H4>
      </XStack>
      <XStack flexWrap='wrap' justify='space-between' gap={8}>
        {bookmarkedPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} width='48%'>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
              variant="bookmark"
              primaryType={pokemon.primaryType}
              types={pokemon.types}
              onRemove={onRemove}
              onSelect={onSelect}
              displayRemoveButton={true}
              bookmarkSource={bookmarkSource}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
