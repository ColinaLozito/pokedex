import { usePokemonStore } from 'app/store/pokemonStore'
import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'

interface RecentSelectionsProps {
  onSelect?: (id: number) => void
}

export default function RecentSelections({ onSelect }: RecentSelectionsProps) {
  const recentSelections = usePokemonStore((state) => state.recentSelections)
  const removeRecentSelection = usePokemonStore((state) => state.removeRecentSelection)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  const theme = useTheme()

  if (recentSelections.length === 0) {
    return null
  }

  const handleRemove = (pokemonId: number) => {
    removeRecentSelection(pokemonId)
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
      <XStack gap="$2" style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {recentPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} style={{ width: '48%' }}>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
              variant="recent"
              primaryType={pokemon.primaryType}
              types={pokemon.types}
              onRemove={handleRemove}
              onSelect={onSelect}
              displayRemoveButton={true}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}

