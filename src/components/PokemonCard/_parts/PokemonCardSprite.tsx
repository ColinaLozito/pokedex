import { Image, Text, YStack } from 'tamagui';
import { POKEMON_CARD_COLORS } from '../constants';
import { PokemonCardSpriteProps } from '../types';

export default function PokemonCardSprite({ 
  sprite, 
  onError, 
}: PokemonCardSpriteProps) {
  const circularBackgroundColor = POKEMON_CARD_COLORS.circularBackground; // This is a placeholder, we can adjust based on variant and primaryType if needed
  
  return (
    <YStack 
      flex={1} 
      justify='flex-start' 
      alignItems='flex-end'
      position='relative' 
      minHeight={60}
    >
      {/* Circular Background */}
      <YStack
        position='absolute'
        width={150}
        height={150}
        borderRadius={100}
        right={-15}
        top={-10}
        bg={circularBackgroundColor}
      />
      
      {/* Pokemon Sprite */}
      {sprite ? (
          <Image
            source={{ uri: sprite }}
            width={90}
            height={90}
            zIndex={1}
            objectFit="contain"
            onError={onError}
          />
      ) : (
        <YStack
          width={70}
          height={70}
          bg={POKEMON_CARD_COLORS.noImageBackground}
          borderRadius={8}
          justify='center'
          items='center'
        >
          <Text fontSize={12} color={POKEMON_CARD_COLORS.mutedText}>
            No Image
          </Text>
        </YStack>
      )}
    </YStack>
  );
}