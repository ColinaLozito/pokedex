import type { CombinedPokemonDetail } from 'app/services/types'
import { RecentSelection } from 'app/store/pokemonGeneralStore'
import { transformPokemonToDisplayData } from 'app/utils/pokemonDisplayData'
import { useMemo } from 'react'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'

interface RecentSelectionsProps {
  recentSelections: RecentSelection[]
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
}

export default function RecentSelections({ 
  recentSelections,
  getPokemonDetail,
  onRemove,
  onSelect 
}: RecentSelectionsProps) {
  const theme = useTheme()

  // Get Pokemon data with sprites for each recent selection
  // Must be called before early return to follow Rules of Hooks
  const recentPokemonData = useMemo(() => {
    return recentSelections.map((pokemon) => 
      transformPokemonToDisplayData(
        pokemon.id,
        pokemon.name,
        getPokemonDetail
      )
    )
  }, [recentSelections, getPokemonDetail])

  if (recentSelections.length === 0) {
    return null
  }

  return (
    <YStack gap={13}>
      <H4 color={theme.text.val}>Recently Inspected</H4>
      <XStack gap={7} flexWrap='wrap' justify='space-between'>
        {recentPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} width='48%'>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
              variant="recent"
              primaryType={pokemon.primaryType}
              types={pokemon.types}
              onRemove={onRemove}
              onSelect={onSelect}
              displayRemoveButton={true}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
