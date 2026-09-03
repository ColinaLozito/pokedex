import imageNotFound from '@images/notFound.png';
import { useState } from 'react';
import { Image as RNImage } from 'react-native';
import { Image, Square, YStack } from 'tamagui';
import { POKEMON_CARD_COLORS } from '../constants';
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
      justifyContent='flex-start' 
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
      <Square
        w="$size.8"
        h="$size.8"
        alignSelf="flex-end"
        transition="slow"
        enterStyle={{
          opacity: 0,
          scale: 0.5,
        }}
      >
      {sprite ? (
          <Image
            src={imageError ? RNImage.resolveAssetSource(imageNotFound).uri : sprite}
            width="100%"
            height="100%"
            zIndex={1}
            objectFit="contain"
            onError={() => setImageError(true)}
          />
      ) : (
        <Image
          src={RNImage.resolveAssetSource(imageNotFound).uri}
          width="100%"
          height="100%"
          zIndex={1}
          objectFit="contain"
          onError={() => setImageError(true)}
        />
      )}
      </Square>
    </YStack>
  );
}