import { X } from '@tamagui/lucide-icons'
import { getTypeColor } from 'app/utils/getTypeColor'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import { Button, Card, GetThemeValueForKey, Image, Text, XStack, YStack } from 'tamagui'
import TypeChips from './TypeChips'

// Constants for PokemonCard styling
const POKEMON_CARD_COLORS = {
  buttonBackground: 'rgba(0, 0, 0, 0.2)',
  circularBackground: 'rgba(255, 255, 255, 0.15)',
  noImageBackground: 'rgba(255, 255, 255, 0.2)',
  mutedText: 'rgba(255, 255, 255, 0.7)',
} as const

interface PokemonCardProps {
  id: number
  name: string
  sprite?: string | null
  variant?: 'recent' | 'bookmark'
  primaryType?: string  // Pokemon's primary type for background coloring
  displayRemoveButton?: boolean
  types?: Array<{      // All Pokemon types for display
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  onRemove: (id: number) => void
  onSelect?: (id: number) => void
  bookmarkSource?: 'parent' | 'kid' // Source for bookmark system when navigating
  // Optional: If not provided, onSelect must handle navigation
  onNavigate?: (id: number, source: 'parent' | 'kid') => void
}

export default function PokemonCard({ 
  id, 
  name, 
  sprite, 
  variant = 'recent',
  primaryType,
  types,
  displayRemoveButton = false,
  onRemove,
  onSelect,
  bookmarkSource = 'kid', // Default to 'kid' if not specified
  onNavigate
}: PokemonCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const handleCardPress = async () => {
    // Use custom handler if provided
    if (onSelect) {
      onSelect(id)
      return
    }

    // Use navigation handler if provided
    if (onNavigate) {
      onNavigate(id, bookmarkSource)
      return
    }

    // Fallback: direct navigation (not recommended, but kept for backward compatibility)
    router.push({
      pathname: '/screens/pokemonDetails',
      params: { source: bookmarkSource, id: id.toString() }
    })
  }

  const handleRemove = (e: GestureResponderEvent) => {
    e.stopPropagation()
    onRemove(id)
  }


  const backgroundColor = (
    getTypeColor(primaryType, variant)
  ) as GetThemeValueForKey<"backgroundColor">

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
          {/* Remove Button - Top Right */}
          {
            displayRemoveButton && (
              <XStack position='absolute' top={6} right={6} zIndex={10}>
                <Button
                  size={24}
                  circular
                  icon={X}
                  chromeless
                  style={{ backgroundColor: POKEMON_CARD_COLORS.buttonBackground }}
                  color="white"
                  onPress={handleRemove}
                />
              </XStack>
            )
          }
          {/* Top Section: Name and Number */}
          <XStack justify='space-between' items='center'>
            <Text 
              fontSize={14} 
              color="white" 
              textTransform="capitalize"
              numberOfLines={1}
              lineHeight={24}
              fontWeight={800}
            >
              {name}
            </Text>
            <Text 
              fontSize={14} 
              color="white"
              fontWeight={500}
            >
              #{id.toString().padStart(3, '0')}
            </Text>
          </XStack>

          {/* Middle Section: Pokemon Sprite with Circular Background */}
          <XStack 
            flex={1} 
            justify='flex-end' 
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
              bg={POKEMON_CARD_COLORS.circularBackground}
            />
            
            {/* Pokemon Sprite */}
            {sprite && !imageError ? (
              <Image
                source={{ uri: sprite }}
                width={90}
                height={90}
                zIndex={1}
                objectFit="contain"
                onError={() => setImageError(true)}
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
          </XStack>

          {/* Bottom Section: Type Chips */}
          {types && types.length > 0 ? (
            <XStack mt={8}>
              <TypeChips types={types} size="small" gap={6} />
            </XStack>
          ) : 
            <XStack mt={8} ml={24}>
              <Text fontSize={24} color={POKEMON_CARD_COLORS.mutedText}>??</Text>
            </XStack>
          }
        </YStack>
      </Card>
    </Pressable>
  )
}

