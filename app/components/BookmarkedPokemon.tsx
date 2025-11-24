import { Bookmark } from '@tamagui/lucide-icons'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'
import { CombinedPokemonDetail, PokemonDetail } from 'app/services/api'

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
  
  if (bookmarkedPokemonIds.length === 0) {
    return null
  }

  // Get Pokemon data for each bookmarked ID
  const bookmarkedPokemonData = bookmarkedPokemonIds.map((id) => {
    // Try to get full details first, fall back to basic cache
    const fullData = getPokemonDetail(id)
    const basicData = getBasicPokemon(id)
    
    // Get all types and primary type
    const types = fullData?.types || basicData?.types || undefined
    const primaryType = types?.[0]?.type?.name || undefined
    
    // Use direct sprite URL (no need to fetch just for sprite)
    // If we have cached data, use it; otherwise use direct URL
    const sprite = fullData 
      ? getPokemonSprite(fullData, id)
      : (basicData 
        ? getPokemonSprite(basicData, id)
        : getPokemonSpriteUrl(id))
    
    return {
      id,
      name: fullData?.name || basicData?.name || `Pokemon #${id}`,
      sprite,
      primaryType,
      types
    }
  })

  return (
    <YStack style={{ gap: 12 }}>
      <XStack style={{ gap: 8, alignItems: 'center' }}>
        <Bookmark size={20} color={theme.text.val} fill={theme.text.val} />
        <H4 color={theme.text.val}>Bookmarked</H4>
      </XStack>
      <XStack style={{ flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
        {bookmarkedPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} style={{ width: '48%' }}>
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
