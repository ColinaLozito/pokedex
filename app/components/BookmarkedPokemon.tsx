import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { Bookmark } from '@tamagui/lucide-icons'
import { H4, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'

interface BookmarkedPokemonProps {
  onSelect?: (id: number) => void
}

export default function BookmarkedPokemon({ onSelect }: BookmarkedPokemonProps) {
  // Get bookmarked Pokemon IDs and functions
  const bookmarkedPokemonIds = usePokemonDataStore((state) => state.bookmarkedPokemonIds)
  const toggleBookmark = usePokemonDataStore((state) => state.toggleBookmark)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)

  if (bookmarkedPokemonIds.length === 0) {
    return null
  }

  const handleRemoveBookmark = (pokemonId: number) => {
    console.log(`[BOOKMARKS] Removing bookmark for Pokemon ID: ${pokemonId}`)
    toggleBookmark(pokemonId)
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
    <YStack gap="$3">
      <XStack gap="$2" style={{ alignItems: 'center' }}>
        <Bookmark size={20} color="$yellow10" fill="$yellow10" />
        <H4>Bookmarked Pokemon</H4>
      </XStack>
      <XStack gap="$2" style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {bookmarkedPokemonData.map((pokemon) => (
          <YStack key={pokemon.id} style={{ width: '48%' }}>
            <PokemonCard
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
              variant="bookmark"
              primaryType={pokemon.primaryType}
              types={pokemon.types}
              onRemove={handleRemoveBookmark}
              onSelect={onSelect}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}

