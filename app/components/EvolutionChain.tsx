import EvolutionSpriteContainer from 'app/components/EvolutionSpriteContainer'
import type { EvolutionChainLink, PokemonDetail } from 'app/services/types'
import { buildEvolutionTree, collectEvolutionVariants, isBranchingEvolution, type EvolutionNode } from 'app/utils/evolutionTree'
import { getPokemonSprite, getPokemonSpriteUrl } from 'app/utils/pokemonSprites'
import { useCallback, useMemo } from 'react'
import { H4, Text, useTheme, XStack, YStack } from 'tamagui'

interface EvolutionChainProps {
  evolutionChainTree: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
  getBasicPokemon?: (id: number) => PokemonDetail | undefined
}

export default function EvolutionChain({ 
  evolutionChainTree, 
  currentPokemonId,
  onPokemonPress,
  getBasicPokemon
}: EvolutionChainProps) {
  const theme = useTheme()
  
  // Build the evolution tree (memoized to avoid recalculation)
  const rootNode = useMemo(() => buildEvolutionTree(evolutionChainTree), [evolutionChainTree])
  
  // Check if it's branching (memoized to avoid recalculation)
  const isBranching = useMemo(() => isBranchingEvolution(evolutionChainTree), [evolutionChainTree])
  
  // Get sprite for a Pokemon (with cache fallback and error handling)
  const getSprite = useCallback((pokemonId: number): string => {
    // Validate Pokemon ID
    if (!pokemonId || pokemonId <= 0 || !Number.isInteger(pokemonId)) {
      // Return a fallback sprite URL for invalid IDs
      return getPokemonSpriteUrl(1) // Default to Bulbasaur
    }
    
    // Try to get cached data
    const cached = getBasicPokemon?.(pokemonId)
    if (cached) {
      // Validate cached data has required structure
      if (typeof cached === 'object' && cached !== null) {
        const sprite = getPokemonSprite(cached, pokemonId)
        // Validate sprite URL is not empty
        if (sprite && sprite.trim().length > 0) {
          return sprite
        }
      }
    }
    
    // Fallback to direct URL based on ID
    return getPokemonSpriteUrl(pokemonId)
  }, [getBasicPokemon])
  
  // Render a single Pokemon card (for branching evolution)
  const renderPokemonSprite = useCallback((node: EvolutionNode, isCurrent: boolean = false, variantType: 'branching-variant' | 'branching-initial' | 'linear') => {
    const sprite = getSprite(node.id)
    return (
      <EvolutionSpriteContainer
        sprite={sprite}
        name={node.name}
        id={node.id}
        isCurrent={isCurrent}
        onPress={() => onPokemonPress(node.id)}
        variant={variantType}
      />
    )
  }, [getSprite, onPokemonPress])
  
  // VARIANT 1: Linear Evolution - Each Pokemon in column (image, name, ID) with arrows between
  const renderLinearEvolution = (node: EvolutionNode): React.ReactNode => {
    const nodes: EvolutionNode[] = []
    
    // Flatten linear chain
    let current: EvolutionNode | null = node
    while (current) {
      nodes.push(current)
      // In linear evolution, there's only one path
      current = current.evolvesTo.length > 0 ? current.evolvesTo[0] : null
    }
    
    return (
      <XStack 
        items='center'
        justify='center'
        flexWrap='wrap'
        gap={4}
      >
        {nodes.map((evolutionNode, index) => (
          <XStack key={`${evolutionNode.id}-${index}`} items='center'>
            {renderPokemonSprite(evolutionNode, evolutionNode.id === currentPokemonId, 'linear')}
            
            {/* Arrow between evolutions */}
            {index < nodes.length - 1 && (
              <XStack justify='center' m={0}>
                <Text 
                  fontSize={20} 
                  fontWeight={300}
                  color={theme.text.val}
                >
                  →
                </Text>
              </XStack>
            )}
          </XStack>
        ))}
      </XStack>
    )
  }
  
  // VARIANT 2: Branching Evolution - Initial at top, variants in 3-column grid
  const renderBranchingEvolution = (node: EvolutionNode): React.ReactNode => {
    // Collect all evolution variants
    const variants = collectEvolutionVariants(node)
    
    return (
      <YStack items='center' gap={12} width='100%'>
        {/* Initial Pokemon at top (centered) */}
        {renderPokemonSprite(node, node.id === currentPokemonId, 'branching-initial')}
        
        {/* Evolution variants in 3-column grid */}
        {variants.length > 0 && (
          <XStack 
            flexWrap='wrap'
            justify='center'
            width='100%'
          >
            {variants.map((variant, index) => (
              <YStack 
                key={`${variant.id}-${index}`} 
                width='30%'
                items='center'
              >
                {renderPokemonSprite(variant, variant.id === currentPokemonId, 'branching-variant')}
              </YStack>
            ))}
          </XStack>
        )}
      </YStack>
    )
  }
  
  return (
    <YStack width='100%'>
      <H4 mb={24} text='center' color={theme.text.val}>Evolution</H4>
      
      {isBranching ? (
        // Branching evolution (variants)
        renderBranchingEvolution(rootNode)
      ) : (
        // Linear evolution (horizontal chain with arrows)
        renderLinearEvolution(rootNode)
      )}
    </YStack>
  )
}
