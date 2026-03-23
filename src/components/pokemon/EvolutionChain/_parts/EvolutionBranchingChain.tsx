import EvolutionSpriteContainer from '@/components/pokemon/EvolutionSpriteContainer'
import { getPokemonSprite } from 'src/utils/pokemonSprites'
import { XStack, YStack } from 'tamagui'
import { collectEvolutionVariants } from 'src/utils/evolutionTree'
import type { EvolutionBranchingChainProps } from '../types'

export default function EvolutionBranchingChain({
  rootNode,
  currentPokemonId,
  onPokemonPress,
  getPokemonDetail,
}: EvolutionBranchingChainProps) {
  const variants = collectEvolutionVariants(rootNode)

  return (
    <YStack items='center' gap="$1" width='100%'>
      <EvolutionSpriteContainer
        sprite={getPokemonSprite(getPokemonDetail?.(rootNode.id), rootNode.id)}
        name={rootNode.name}
        id={rootNode.id}
        isCurrent={rootNode.id === currentPokemonId}
        onPress={() => onPokemonPress(rootNode.id)}
        variant='branching-initial'
      />
      
      {variants.length > 0 && (
        <XStack flexWrap='wrap' justify='center' width='100%'>
          {variants.map((variant, index) => (
            <YStack key={`${variant.id}-${index}`} width='30%' items='center'>
              <EvolutionSpriteContainer
                sprite={getPokemonSprite(getPokemonDetail?.(variant.id), variant.id)}
                name={variant.name}
                id={variant.id}
                isCurrent={variant.id === currentPokemonId}
                onPress={() => onPokemonPress(variant.id)}
                variant='branching-variant'
              />
            </YStack>
          ))}
        </XStack>
      )}
    </YStack>
  )
}
