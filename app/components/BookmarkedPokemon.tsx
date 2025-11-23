import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { Bookmark } from '@tamagui/lucide-icons'
import { H4, useTheme, XStack, YStack } from 'tamagui'
import PokemonCard from './PokemonCard'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'

interface BookmarkedPokemonProps {
  onSelect?: (id: number) => void
  variant?: 'kid' | 'parent' // Specify which bookmark type to use
}

export default function BookmarkedPokemon({ onSelect, variant = 'kid' }: BookmarkedPokemonProps) {
  const theme = useTheme()
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  
  // Get bookmarked Pokemon IDs and functions based on variant
  const bookmarkedPokemonIds = usePokemonDataStore((state) => 
    variant === 'parent' ? state.parentBookmarkedPokemonIds : state.bookmarkedPokemonIds
  )
  const toggleBookmark = usePokemonDataStore((state) => 
    variant === 'parent' ? state.toggleParentBookmark : state.toggleBookmark
  )
  
  if (bookmarkedPokemonIds.length === 0) {
    return null
  }

  const handleRemoveBookmark = (pokemonId: number) => {
    console.log(`[BOOKMARKS] Removing bookmark for Pokemon ID: ${pokemonId} (variant: ${variant})`)
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
    <YStack style={{ gap: 12 }}>
      <XStack style={{ gap: 8, alignItems: 'center' }}>
        <Bookmark size={20} color={theme.text.val} fill={theme.text.val} />
        <H4 color={theme.text.val}>Bookmarked Pokemon</H4>
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
              onRemove={handleRemoveBookmark}
              onSelect={onSelect}
              displayRemoveButton={true}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}

