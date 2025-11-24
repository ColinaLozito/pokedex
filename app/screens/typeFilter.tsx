import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { Button, H2, Text, XStack, YStack, Image, useTheme } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { fetchPokemonByType } from 'app/services/api'
import { PokemonListItem } from 'app/services/api'
import { pokemonTypeColors } from 'config/colors'
import typeSymbolsIcons from 'app/helpers/typeSymbolsIcons'
import PokemonCard from 'app/components/PokemonCard'
import { usePokemonDataStore, setToastController } from 'app/store/pokemonDataStore'
import { usePokemonStore } from 'app/store/pokemonStore'
import { useToastController } from '@tamagui/toast'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'

export default function TypeFilterScreen() {
  const router = useRouter()
  const toast = useToastController()
  const params = useLocalSearchParams<{ typeId: string; typeName: string }>()
  
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const typeId = params.typeId ? parseInt(params.typeId, 10) : null
  const typeName = params.typeName || 'Unknown'
  
  const fetchPokemonDetail = usePokemonDataStore((state) => state.fetchPokemonDetail)
  const setCurrentPokemonId = usePokemonDataStore((state) => state.setCurrentPokemonId)
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  const getPokemonDetail = usePokemonDataStore((state) => state.getPokemonDetail)
  // Subscribe to store changes to trigger re-renders when Pokemon data is updated
  // This ensures cards update when returning from pokemonDetails screen
  usePokemonDataStore((state) => state.pokemonDetails)
  usePokemonDataStore((state) => state.basicPokemonCache)
  const addRecentSelection = usePokemonStore((state) => state.addRecentSelection)
  const theme = useTheme()
  
  // Set toast controller
  useEffect(() => {
    setToastController(toast)
  }, [toast])
  
  // Fetch Pokemon by type
  useEffect(() => {
    const loadPokemon = async () => {
      if (!typeId) {
        setError('Invalid type ID')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const pokemon = await fetchPokemonByType(typeId)
        setPokemonList(pokemon)
      } catch (err) {
        console.error('Failed to fetch Pokemon by type:', err)
        setError('Failed to load Pokemon')
        toast.show('Error', { message: 'Failed to load Pokemon for this type' })
      } finally {
        setLoading(false)
      }
    }
    
    loadPokemon()
  }, [typeId, toast])
  
  // Handle Pokemon card selection
  const handlePokemonSelect = async (id: number) => {
    const selectedPokemon = pokemonList.find((p) => p.id === id)
    
    if (!selectedPokemon) {
      return
    }
    
    try {
      await fetchPokemonDetail(id)
      addRecentSelection(selectedPokemon)
      setCurrentPokemonId(id)
      router.push({
        pathname: '/screens/pokemonDetails',
        params: { source: 'kid' }
      })
    } catch (error) {
      console.error('Failed to fetch Pokémon details:', error)
    }
  }
  
  // Handle remove (not used in this context, but required by PokemonCard)
  const handleRemove = () => {
    // No-op for type filter screen
  }
  
  // Get type color
  const typeColor = pokemonTypeColors[typeName.toLowerCase() as keyof typeof pokemonTypeColors] || '#A8A77A'
  
  // Get type symbol icon
  const typeIcon = typeSymbolsIcons[typeName.toLowerCase() as keyof typeof typeSymbolsIcons]
  
  // Prepare Pokemon data for cards - this will re-compute when store updates
  const pokemonData = pokemonList.map((pokemon) => {
    const fullData = getPokemonDetail(pokemon.id)
    const basicData = getBasicPokemon(pokemon.id)
    const types = fullData?.types || basicData?.types || undefined
    const primaryType = types?.[0]?.type?.name || typeName.toLowerCase()
    const sprite = fullData 
      ? getPokemonSprite(fullData, pokemon.id)
      : (basicData 
        ? getPokemonSprite(basicData, pokemon.id)
        : getPokemonSpriteUrl(pokemon.id))
    
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite,
      primaryType,
      types
    }
  })
  
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: typeColor }}>
        <YStack flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="white" />
          <Text color="white" style={{ marginTop: 16 }}>Loading Pokemon...</Text>
        </YStack>
      </SafeAreaView>
    )
  }
  
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: typeColor }}>
        <YStack flex={1} style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text fontSize={28} color="white" style={{ textAlign: 'center' }}>
            {error}
          </Text>
          <Button style={{ marginTop: 16 }} onPress={() => router.back()}>
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    )
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: typeColor }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack 
          style={{ 
            paddingHorizontal: 16, 
            paddingBottom: 12,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Button
            size={40}
            circular
            onPress={() => router.back()}
            icon={ChevronLeft}
            color={theme.text.val}
            scaleIcon={1.7}
            elevate
            shadowColor={theme.shadowColor?.val as any || 'rgba(0, 0, 0, 0.1)'}
            shadowOpacity={0.3}
            shadowRadius={8}
            opacity={0.6}
          />
          
          <XStack style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <H2 
              color="white" 
              textTransform="capitalize"
              fontWeight="800"
            >
              {typeName}
            </H2>
            {typeIcon && (
              <Image
                source={typeIcon}
                style={{
                  position: 'absolute',
                  right: -100,
                  width: 200,
                  height: 200,
                }}
                resizeMode="contain"
              />
            )}
          </XStack>
        </XStack>
        
        {/* Pokemon Grid */}
        <YStack 
          flex={1} 
          style={{ 
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginTop: 8,
            paddingTop: 16,
            paddingHorizontal: 8,
          }}
        >
          <FlashList
            data={pokemonData}
            numColumns={2}
            renderItem={({ item }) => (
              <YStack  style={{padding: 4}}>
                <PokemonCard
                  id={item.id}
                  name={item.name}
                  sprite={item.sprite}
                  variant="recent"
                  primaryType={item.primaryType}
                  types={item.types}
                  onRemove={handleRemove}
                  onSelect={handlePokemonSelect}
                  displayRemoveButton={false}
                />
              </YStack>
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <YStack height={8} />}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}

