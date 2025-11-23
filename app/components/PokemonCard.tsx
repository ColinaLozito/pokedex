import { usePokemonDataStore, setToastController } from 'app/store/pokemonDataStore'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { X } from '@tamagui/lucide-icons'
import { Button, Card, Text, XStack, YStack, Image } from 'tamagui'
import { useToastController } from '@tamagui/toast'
import { pokemonTypeColors } from 'config/colors'
import { Pressable } from 'react-native'
import TypeChips from './TypeChips'

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
  onSelect 
}: PokemonCardProps) {
  const router = useRouter()
  const toast = useToastController()
  
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  
  // Set toast controller
  useEffect(() => {
    setToastController(toast)
  }, [toast])

  const handleCardPress = async () => {
    // Use custom handler if provided
    if (onSelect) {
      onSelect(id)
      return
    }

    // Default behavior: fetch and navigate
    try {
      await fetchPokemonDetail(id)
      setCurrentPokemonId(id)
      router.push('/screens/pokemonDetails')
    } catch (error) {
      console.error('Failed to fetch Pokémon details:', error)
      // Error toast is already shown by the store
    }
  }

  const handleRemove = (e: any) => {
    e.stopPropagation()
    onRemove(id)
  }

  // Get type color for background
  const getTypeColor = () => {
    if (primaryType) {
      const typeColor = pokemonTypeColors[primaryType as keyof typeof pokemonTypeColors]
      if (typeColor) {
        return typeColor
      }
    }
    // Fallback colors - neutral gray for recent, light gray for bookmark without type
    return variant === 'recent' ? '#F5F5F5' : '#E0E0E0'
  }

  const backgroundColor = getTypeColor()

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
        style={{
          backgroundColor,
          height: 150,
          width: '100%',
        }}
      >
        <YStack style={{ padding: 10, height: '100%', position: 'relative' }}>
          {/* Remove Button - Top Right */}
          {
            displayRemoveButton && (
              <XStack style={{ position: 'absolute', top: 6, right: 6, zIndex: 10 }}>
                <Button
                  size="$1.5"
                  circular
                  icon={X}
                  chromeless
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  color="white"
                  onPress={handleRemove}
                />
              </XStack>
            )
          }
          {/* Top Section: Name and Number */}
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text 
              fontSize={18} 
              color="white" 
              textTransform="capitalize"
              numberOfLines={1}
              lineHeight={24}
            >
              {name}
            </Text>
            <Text 
              fontSize={16} 
              color="white"
            >
              #{id.toString().padStart(3, '0')}
            </Text>
          </XStack>

          {/* Middle Section: Pokemon Sprite with Circular Background */}
          <XStack 
            style={{ 
              flex: 1, 
              justifyContent: 'flex-end', 
              position: 'relative', 
              minHeight: 60
             }}
          >
            {/* Circular Background */}
            <YStack
              style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: 100,
                right: -15,
                top: -10,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              }}
            />
            
            {/* Pokemon Sprite */}
            {sprite ? (
              <Image
                source={{ uri: sprite }}
                style={{
                  width: 90,
                  height: 90,
                  zIndex: 1,
                }}
                resizeMode="contain"
              />
            ) : (
              <YStack
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text fontSize="$1" color="rgba(255, 255, 255, 0.7)">
                  No Image
                </Text>
              </YStack>
            )}
          </XStack>

          {/* Bottom Section: Type Chips */}
          {types && types.length > 0 && (
            <XStack style={{ marginTop: 8 }}>
              <TypeChips types={types} size="small" gap={6} />
            </XStack>
          )}
        </YStack>
      </Card>
    </Pressable>
  )
}

