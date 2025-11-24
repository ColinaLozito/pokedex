import EvolutionSpriteContainer from 'app/components/EvolutionSpriteContainer'
import { buildEvolutionTree, collectEvolutionVariants, isBranchingEvolution } from 'app/helpers/evolutionTree'
import { getPokemonSprite, getPokemonSpriteUrl } from 'app/helpers/pokemonSprites'
import { EvolutionChainLink, PokemonDetail } from 'app/services/api'
import { EvolutionNode } from 'app/store/pokemonDetailsStore'
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
  
  // Build the evolution tree
  const rootNode = buildEvolutionTree(evolutionChainTree)
  
  // Check if it's branching
  const isBranching = isBranchingEvolution(evolutionChainTree)
  
  // Get sprite for a Pokemon (with cache fallback)
  const getSprite = (pokemonId: number): string => {
    const cached = getBasicPokemon?.(pokemonId)
    if (cached) {
      return getPokemonSprite(cached, pokemonId)
    }
    return getPokemonSpriteUrl(pokemonId)
  }
  
  // Render a single Pokemon card (for linear evolution)
  const renderLinearPokemon = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    return (
      <EvolutionSpriteContainer
        sprite={sprite}
        name={node.name}
        id={node.id}
        isCurrent={isCurrent}
        onPress={() => onPokemonPress(node.id)}
        variant="linear"
      />
    )
  }

  // Render a single Pokemon card (for branching evolution - initial at top)
  const renderBranchingInitial = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    return (
      <EvolutionSpriteContainer
        sprite={sprite}
        name={node.name}
        id={node.id}
        isCurrent={isCurrent}
        onPress={() => onPokemonPress(node.id)}
        variant="branching-initial"
      />
    )
  }

  // Render a single Pokemon card (for branching evolution - variants in grid)
  const renderBranchingVariant = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    return (
      <EvolutionSpriteContainer
        sprite={sprite}
        name={node.name}
        id={node.id}
        isCurrent={isCurrent}
        onPress={() => onPokemonPress(node.id)}
        variant="branching-variant"
      />
    )
  }
  
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
        style={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: 4,
        }}
      >
        {nodes.map((evolutionNode, index) => (
          <XStack key={`${evolutionNode.id}-${index}`} style={{ alignItems: 'center' }}>
            {renderLinearPokemon(evolutionNode, evolutionNode.id === currentPokemonId)}
            
            {/* Arrow between evolutions */}
            {index < nodes.length - 1 && (
              <XStack style={{ marginHorizontal: 0, alignItems: 'center' }}>
                <Text 
                  fontSize={20} 
                  fontWeight="300"
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
      <YStack style={{ alignItems: 'center', gap: 12, width: '100%' }}>
        {/* Initial Pokemon at top (centered) */}
        {renderBranchingInitial(node, node.id === currentPokemonId)}
        
        {/* Evolution variants in 3-column grid */}
        {variants.length > 0 && (
          <XStack 
            style={{ 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {variants.map((variant, index) => (
              <YStack 
                key={`${variant.id}-${index}`} 
                style={{ 
                  width: '30%', // 3 columns (with gaps)
                  alignItems: 'center',
                }}
              >
                {renderBranchingVariant(variant, variant.id === currentPokemonId)}
              </YStack>
            ))}
          </XStack>
        )}
      </YStack>
    )
  }
  
  return (
    <YStack style={{ width: '100%' }}>
      <H4 style={{ marginBottom: 24, textAlign: 'center' }} color={theme.text.val}>Evolution</H4>
      
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
