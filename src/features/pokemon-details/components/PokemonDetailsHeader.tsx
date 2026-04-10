import BookmarkButton from '@/shared/components/ui/atomic/BookmarkButton'
import { GetThemeValueForKey, H2, Image, Text, XStack, YStack } from 'tamagui'
import type { PokemonDetailsHeaderProps } from '../details.types'

export default function PokemonDetailsHeader({
  pokemon,
  isBookmarked,
  onBookmarkPress,
  primaryTypeColor,
}: PokemonDetailsHeaderProps) {
  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default

  return (
    <YStack
      bg="$background"
      paddingHorizontal="$4"
      paddingTop="$6"
      alignItems="center"
    >
      <XStack
        position="absolute"
        top={-650}
        left={-300}
        zIndex={0}
        borderRadius={1000}
        width={1000}
        height={1000}
        bg={primaryTypeColor as GetThemeValueForKey<"backgroundColor">}
        opacity={0.9}
      />
      
      <XStack
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$4"
      >
        <H2
          color="$white"
          textTransform="capitalize"
          fontSize="$7"
          fontWeight="$8"
        >
          {pokemon.name}
        </H2>
        <Text
          color="$opacity9"
          fontSize="$4"
          fontWeight="$6"
        >
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
      </XStack>

      {sprite && (
        <Image
          src={sprite}
          width={250}
          height={250}
          objectFit="contain"
        />
      )}
      
      <BookmarkButton
        isBookmarked={isBookmarked}
        onPress={onBookmarkPress}
        size={40}
        scaleIcon={1.5}
        opacity={0.6}
        position="absolute"
        right={16}
        bottom={200}
      />
    </YStack>
  )
}
