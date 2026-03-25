import PokemonSprite from '@/components/pokemon/PokemonCard/_parts/PokemonSprite';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { getTypeColor } from 'src/utils/pokemon/typeColor';
import { Card, GetThemeValueForKey, YStack } from 'tamagui';
import PokemonCardHeader from './_parts/PokemonCardHeader';
import PokemonCardRemoveButton from './_parts/PokemonCardRemoveButton';
import PokemonCardTypes from './_parts/PokemonCardTypes';
import { PokemonCardProps, PokemonCardVariant } from './types';

function PokemonCardComponent({ 
  id, 
  name, 
  sprite = null, 
  variant = PokemonCardVariant.LIST,
  primaryType = '',
  types = [],
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
      pathname: '/pokemonDetailsV2'
    })
  }, [id, onSelect, onNavigate, router])

  const backgroundColor = useMemo(() => (
    getTypeColor(primaryType)
  ) as GetThemeValueForKey<"backgroundColor">, [primaryType])

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
        borderRadius="$3"
        overflow="hidden"
        bg={backgroundColor}
        height={150}
        width="100%"
      >
        <YStack p="$3" height="100%" position="relative">
          { variant !== PokemonCardVariant.LIST && 
            <PokemonCardRemoveButton 
              onRemove={onRemove}
              id={id}
            />
          }
          <PokemonCardHeader id={id} name={name} />
          
          {/* Middle Section: Pokemon Sprite with Circular Background */}
          <PokemonSprite
            sprite={sprite}
          />
          
          {/* Bottom Section: Type Chips */}
          <PokemonCardTypes types={types} primaryType={primaryType} />
        </YStack>
      </Card>
    </Pressable>
  )
}

export default React.memo(PokemonCardComponent);
