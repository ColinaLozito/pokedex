import type { CombinedPokemonDetail, PokemonDetail } from 'app/services/types'
import { RecentSelection } from 'app/store/pokemonStore'
import { transformPokemonToDisplayData } from 'app/utils/pokemonDisplayData'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'

interface RecentSelectionsProps {
  recentSelections: RecentSelection[]
  getPokemonDetail: (id: number) => CombinedPokemonDetail | undefined
  getBasicPokemon: (id: number) => PokemonDetail | undefined
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
}

export default function RecentSelections({ 
  recentSelections,
  getPokemonDetail,
  getBasicPokemon,
  onRemove,
  onSelect 
}: RecentSelectionsProps) {
  const theme = useTheme()

  if (recentSelections.length === 0) {
    return null
  }

  // Get Pokemon data with sprites for each recent selection
  const recentPokemonData = recentSelections.map((pokemon) => 
    transformPokemonToDisplayData(
      pokemon.id,
      pokemon.name,
      getPokemonDetail,
      getBasicPokemon
    )
  )

  return (
    <YStack gap={13}>
      <H4 color={theme.text.val}>Recent Selections</H4>
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
