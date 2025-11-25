import { ImageBackground } from 'react-native'
import { Button, Card, H3, Text, YStack, useTheme } from 'tamagui'
import PokeballWallpaper from '../../assets/images/pokeball-patten.png'
import type { CombinedPokemonDetail } from '../services/types'
import BookmarkButton from './BookmarkButton'
import PokemonCard from './PokemonCard'

interface DailyPokemonCardProps {
  selectedPokemonId: number | null
  displayPokemon: CombinedPokemonDetail | null
  sprite: string | null
  isBookmarked: boolean
  isLoading: boolean
  isShuffling: boolean
  onGetPokemon: () => void
  onPokemonPress: (id: number) => void
  onToggleBookmark: (id: number) => void
}

export default function DailyPokemonCard({
  selectedPokemonId,
  displayPokemon,
  sprite,
  isBookmarked,
  isLoading,
  isShuffling,
  onGetPokemon,
  onPokemonPress,
  onToggleBookmark,
}: DailyPokemonCardProps) {
  const theme = useTheme()

  // If no Pokemon selected, show "Get Pokemon" card
  if (!selectedPokemonId) {
    return (
      <Card elevate bordered background={theme.red.val}>
        <Card.Header padded>
          <YStack gap={20} items='center' width='100%' py={24}>
            <H3 textAlign='center' color={theme.text.val}>
              Get your pokemon of the day
            </H3>
            <Button
              onPress={onGetPokemon}
              disabled={isLoading || isShuffling}
              size={68}
              backgroundColor={theme.water?.val}
              color={theme.text.val}
              width="100%"
              height={68}
            >
              <Text fontSize={18} fontWeight={600}>
                {isLoading ? 'Loading...' : isShuffling ? 'Shuffling...' : 'Get Pokemon'}
              </Text>
            </Button>
          </YStack>
        </Card.Header>
      </Card>
    )
  }

  // If Pokemon is selected but data not loaded yet, show loading state
  if (!displayPokemon) {
    return (
      <Card elevate>
        <Card.Header padded>
          <YStack gap={12} items='center' width='100%' py={24}>
            <Text fontSize={16} textAlign='center' color={theme.text.val}>
              Loading Pokemon...
            </Text>
          </YStack>
        </Card.Header>
      </Card>
    )
  }

  // Show the actual Pokemon card when data is available
  return (
    <Card elevate>
      <Card.Header padded>
        <ImageBackground
          source={PokeballWallpaper}
          imageStyle={{
            width: '100%',
            height: 'auto',
            overflow: 'hidden',
            borderRadius: 16,
          }}
          style={{
            width: '100%',
            height: 'auto',
            overflow: 'hidden',
            borderRadius: 16,
          }}
        >
          <YStack
            gap={12}
            items='center'
            width='100%'
            paddingTop={24}
          >
            <YStack width='70%'>
              <PokemonCard
                id={displayPokemon.id}
                name={displayPokemon.name}
                sprite={sprite}
                variant="recent"
                primaryType={displayPokemon.types?.[0]?.type.name || 'normal'}
                types={displayPokemon.types || []}
                onRemove={() => {}}
                onSelect={onPokemonPress}
                displayRemoveButton={false}
                bookmarkSource="parent"
              />
            </YStack>

            {/* Bookmark Button */}
            <BookmarkButton
              isBookmarked={isBookmarked}
              onPress={() => onToggleBookmark(selectedPokemonId)}
              size={68}
              backgroundColor="rgba(255, 255, 255, 0.3)"
            />
          </YStack>
        </ImageBackground>
      </Card.Header>
    </Card>
  )
}
