import { POKEMON_CARD_COLORS } from '../constants';
import imageNotFound from '@images/notFound.png';
import { useState } from 'react';
import { Image as RNImage } from 'react-native';
import { Image, YStack } from 'tamagui';
import { PokemonCardSpriteProps } from '../types';

export default function PokemonSprite({ 
  sprite,
  baseID = ''
}: PokemonCardSpriteProps) {
  const spriteTestID = baseID ? `${baseID}-sprite` : undefined
  const circularBackgroundColor = POKEMON_CARD_COLORS.circularBackground;
  const [imageError, setImageError] = useState(false);

  return (
    <YStack   
      flex={1} 
      justify='flex-start' 
      alignItems='flex-end'
      position='relative' 
      minHeight="$7"
      testID={spriteTestID}
    >
      {/* Circular Background */}
      <YStack
        position='absolute'
        width="$12"
        height="$12"
        borderRadius="$100"
        right={-15}
        top={-10}
        bg={circularBackgroundColor}
      />
      
      {/* Pokemon Sprite */}
      {sprite ? (
          <Image
            source={{ uri: imageError ? RNImage.resolveAssetSource(imageNotFound).uri : sprite }}
            width="$8"
            height="$8"
            zIndex={1}
            objectFit="contain"
            onError={() => setImageError(true)}
          />
      ) : (
        <Image
          source={{ uri: RNImage.resolveAssetSource(imageNotFound).uri }}
          width="$8"
          height="$8"
          zIndex={1}
          objectFit="contain"
          onError={() => setImageError(true)}
        />
      )}
    </YStack>
  );
}