import { usePokemonDataStore } from 'app/store/pokemonDataStore'
import { EvolutionChainLink } from 'app/services/api'
import { extractPokemonId } from 'app/helpers/extractPokemonId'
import { getPokemonSpriteUrl, getPokemonSprite } from 'app/helpers/pokemonSprites'
import { Pressable } from 'react-native'
import { Text, XStack, YStack, Image, H4 } from 'tamagui'

interface EvolutionChainProps {
  evolutionChainTree: EvolutionChainLink
  currentPokemonId: number
  onPokemonPress: (id: number) => void
}

interface EvolutionNode {
  id: number
  name: string
  sprite: string
  evolvesTo: EvolutionNode[]
}

/**
 * Convert EvolutionChainLink tree to a structured node tree
 */
function buildEvolutionTree(chain: EvolutionChainLink): EvolutionNode {
  const id = extractPokemonId(chain.species.url)
  
  return {
    id,
    name: chain.species.name,
    sprite: getPokemonSpriteUrl(id),
    evolvesTo: chain.evolves_to.map(buildEvolutionTree)
  }
}

/**
 * Check if evolution chain is branching (has multiple paths)
 * For branching: initial Pokemon has more than 1 direct evolution
 */
function isBranchingEvolution(chain: EvolutionChainLink): boolean {
  // If first Pokemon has more than 1 evolution, it's branching (like Eevee, Tyrogue)
  return chain.evolves_to.length > 1
}

/**
 * Collect all evolution variants from a branching node
 */
function collectEvolutionVariants(node: EvolutionNode): EvolutionNode[] {
  const variants: EvolutionNode[] = []
  
  // Collect all direct evolutions
  node.evolvesTo.forEach(evolution => {
    variants.push(evolution)
    // Also collect any further evolutions (in case of multi-stage branching)
    if (evolution.evolvesTo.length > 0) {
      evolution.evolvesTo.forEach(subEvolution => {
        variants.push(subEvolution)
      })
    }
  })
  
  return variants
}

export default function EvolutionChain({ 
  evolutionChainTree, 
  currentPokemonId,
  onPokemonPress 
}: EvolutionChainProps) {
  const getBasicPokemon = usePokemonDataStore((state) => state.getBasicPokemon)
  
  // Build the evolution tree
  const rootNode = buildEvolutionTree(evolutionChainTree)
  
  // Check if it's branching
  const isBranching = isBranchingEvolution(evolutionChainTree)
  
  // Get sprite for a Pokemon (with cache fallback)
  const getSprite = (pokemonId: number): string => {
    const cached = getBasicPokemon(pokemonId)
    if (cached) {
      return getPokemonSprite(cached, pokemonId)
    }
    return getPokemonSpriteUrl(pokemonId)
  }
  
  // Render a single Pokemon card (for linear evolution)
  const renderLinearPokemon = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    
    return (
      <Pressable
        onPress={() => onPokemonPress(node.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <YStack
          style={{
            alignItems: 'center',
            padding: 8,
            borderRadius: 12,
            //backgroundColor: isCurrent ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            minWidth: "20%",
            maxWidth: "100%",
          }}
        >
          <Image
            source={{ uri: sprite }}
            style={{
              width: 50,
              height: 50,
            }}
            resizeMode="contain"
          />
          <Text 
            fontSize="$1" 
            fontWeight="700" 
            textTransform="capitalize"
            style={{ marginTop: 8, textAlign: 'center' }}
          >
            {node.name}
          </Text>
          <Text 
            fontSize="$2" 
            style={{ marginTop: 4 }}
          >
            #{node.id.toString().padStart(3, '0')}
          </Text>
        </YStack>
      </Pressable>
    )
  }
  
  // Render a single Pokemon card (for branching evolution - initial at top)
  const renderBranchingInitial = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    
    return (
      <Pressable
        onPress={() => onPokemonPress(node.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <YStack
          style={{
            alignItems: 'center',
            padding: 12,
            borderRadius: 12,
            //backgroundColor: isCurrent ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          }}
        >
          <Image
            source={{ uri: sprite }}
            style={{
              width: 70,
              height: 70,
            }}
            resizeMode="contain"
          />
          <Text 
            fontSize="$2" 
            fontWeight="700" 
            textTransform="capitalize"
            style={{ marginTop: 12, textAlign: 'center' }}
          >
            {node.name}
          </Text>
          <Text 
            fontSize="$3" 
            style={{ marginTop: 6 }}
          >
            #{node.id.toString().padStart(3, '0')}
          </Text>
        </YStack>
      </Pressable>
    )
  }
  
  // Render a single Pokemon card (for branching evolution - variants in grid)
  const renderBranchingVariant = (node: EvolutionNode, isCurrent: boolean = false) => {
    const sprite = getSprite(node.id)
    
    return (
      <Pressable
        onPress={() => onPokemonPress(node.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <YStack
          style={{
            alignItems: 'center',
            padding: 8,
            borderRadius: 12,
            backgroundColor: isCurrent ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: '100%',
          }}
        >
          <Image
            source={{ uri: sprite }}
            style={{
              width: 70,
              height: 70,
            }}
            resizeMode="contain"
          />
          <Text 
            fontSize="$2" 
            fontWeight="700" 
            textTransform="capitalize"
            style={{ marginTop: 6, textAlign: 'center' }}
          >
            {node.name}
          </Text>
          <Text 
            fontSize="$2" 
            style={{ marginTop: 4 }}
          >
            #{node.id.toString().padStart(3, '0')}
          </Text>
        </YStack>
      </Pressable>
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
                  fontSize="$4" 
                  fontWeight="300"
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
      <H4 style={{ marginBottom: 24, textAlign: 'center' }}>Evolution</H4>
      
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
