import type { CombinedPokemonDetail, PokemonDetail } from 'app/services/types'
import { RecentSelection } from 'app/store/pokemonStore'
import { getPokemonSprite, getPokemonSpriteUrl } from 'app/utils/pokemonSprites'
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
  const recentPokemonData = recentSelections.map((pokemon) => {
    // Try to get full details first, fall back to basic cache
    const fullData = getPokemonDetail(pokemon.id)
    const basicData = getBasicPokemon(pokemon.id)
    
    // Get all types and primary type
    const types = fullData?.types || basicData?.types || undefined
    const primaryType = types?.[0]?.type?.name || undefined
    
    // Use direct sprite URL (no need to fetch just for sprite)
    // If we have cached data, use it; otherwise use direct URL
    const sprite = fullData 
      ? getPokemonSprite(fullData, pokemon.id)
      : (basicData 
        ? getPokemonSprite(basicData, pokemon.id)
        : getPokemonSpriteUrl(pokemon.id))
    
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite,
      primaryType,
      types
    }
  })

  return (
    <YStack gap="$3">
      <H4 color={theme.text.val}>Recent Selections</H4>
      <XStack gap="$2" flexWrap='wrap' justify='space-between'>
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
