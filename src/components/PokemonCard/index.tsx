import { useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { PokemonCardVariant } from 'src/types/pokemonCardVariant';
import { getTypeColor } from 'src/utils/getTypeColor';
import { Card, GetThemeValueForKey, YStack } from 'tamagui';
import PokemonCardHeader from './_parts/PokemonCardHeader';
import PokemonCardRemoveButton from './_parts/PokemonCardRemoveButton';
import PokemonCardSprite from './_parts/PokemonCardSprite';
import PokemonCardTypes from './_parts/PokemonCardTypes';
import { PokemonCardProps } from './types';

function PokemonCardComponent({ 
  id, 
  name, 
  sprite = null, 
  variant = PokemonCardVariant.LIST,
  primaryType = '',
  types = [],
  displayRemoveButton = false,
  onRemove,
  onSelect,
  onNavigate
}: PokemonCardProps) {
  const router = useRouter()

  const handleCardPress = useCallback(async () => {
    // Use custom handler if provided
    if (onSelect) {
      onSelect(id)
      return
    }

    // Use navigation handler if provided
    if (onNavigate) {
      onNavigate(id)
      return
    }

    // Fallback: direct navigation (not recommended, but kept for backward compatibility)
    router.push({
      pathname: '/pokemonDetails'
    })
  }, [id, onSelect, onNavigate, router])

  const backgroundColor = useMemo(() => (
    getTypeColor(primaryType, variant)
  ) as GetThemeValueForKey<"backgroundColor">, [primaryType, variant])

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        width: '100%',
      })}
    >
      <Card
        elevate
        borderRadius={16}
        overflow="hidden"
        bg={backgroundColor}
        height={150}
        width='100%'
      >
        <YStack p={10} height='100%' position='relative'>
          <PokemonCardRemoveButton 
            displayRemoveButton={displayRemoveButton}
            onRemove={onRemove}
            id={id}
          />
          <PokemonCardHeader id={id} name={name} />
          
          {/* Middle Section: Pokemon Sprite with Circular Background */}
          <PokemonCardSprite
            sprite={sprite}
          />
          
          {/* Bottom Section: Type Chips */}
          <PokemonCardTypes types={types} />
        </YStack>
      </Card>
    </Pressable>
  )
}

export default React.memo(PokemonCardComponent);
