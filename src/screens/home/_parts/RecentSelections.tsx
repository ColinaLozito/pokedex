import PokemonCard from '@/components/pokemon/PokemonCard'
import { PokemonCardVariant } from '@/components/pokemon/PokemonCard/types'
import { useMemo } from 'react'
import { transformPokemonToDisplayData } from 'src/utils/pokemon/displayData'
import { H4, XStack, YStack } from 'tamagui'
import type { RecentSelectionsProps } from '../types'

export default function RecentSelections({ 
  recentSelections,
  getPokemonDetail,
  onRemove,
  onSelect 
}: RecentSelectionsProps) {
  
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
    <YStack gap="$4">
      <H4 color="$text">Recently Inspected</H4>
      <XStack gap="$2" flexWrap='wrap' justify='space-between'>
        {recentPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} width='49%'>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
              variant={PokemonCardVariant.RECENT}
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
