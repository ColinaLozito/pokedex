import RightArrow from '@/shared/components/ui/atomic/RightArrow/RightArrow'
import {
  buildEvolutionTree,
  collectEvolutionVariants,
  flattenLinearChain,
  isBranchingEvolution
} from '@/utils/evolution/evolutionTree'
import { getPokemonSprite } from '@/utils/pokemon/sprites'
import { H4, XStack, YStack } from 'tamagui'
import type { EvolutionChainProps } from '../../../details.types'
import EvolutionSpriteContainer from './EvolutionSpriteContainer'

export default function EvolutionChain(props: EvolutionChainProps) {
  if (!props.evolutionChainTree) {
    return null
  }
  
  const rootNode = buildEvolutionTree(props.evolutionChainTree)
  const isBranching = isBranchingEvolution(props.evolutionChainTree)
  const variants = collectEvolutionVariants(rootNode)
  return (
    <YStack width='100%'>
      <H4 mb="$5" textAlign='center' color="$text">Evolution</H4>
      
      {isBranching ? (
       <YStack alignItems='center' gap="$1" width='100%'>
       <EvolutionSpriteContainer
         sprite={getPokemonSprite(props.getPokemonDetail?.(rootNode.id), rootNode.id)}
         name={rootNode.name}
         id={rootNode.id}
         isCurrent={rootNode.id === props.currentPokemonId}
         onPress={() => props.onPokemonPress(rootNode.id)}
         variant='branching-initial'
       />
       
       {variants.length > 0 && (
         <XStack flexWrap='wrap' justifyContent='center' width='100%'>
           {variants.map((variant, index) => (
             <YStack key={`${variant.id}-${index}`} width='30%' alignItems='center'>
               <EvolutionSpriteContainer
                 sprite={getPokemonSprite(props.getPokemonDetail?.(variant.id), variant.id)}
                 name={variant.name}
                 id={variant.id}
                 isCurrent={variant.id === props.currentPokemonId}
                 onPress={() => props.onPokemonPress(variant.id)}
                 variant='branching-variant'
               />
             </YStack>
           ))}
         </XStack>
       )}
     </YStack>
      ) : (
        <XStack alignItems='center' justifyContent='center' flexWrap='wrap' gap="$1">
          {flattenLinearChain(rootNode).map((node, index) => (
            <XStack key={`${node.id}-${index}`} alignItems='center'>
              <EvolutionSpriteContainer
                sprite={getPokemonSprite(props.getPokemonDetail?.(node.id), node.id)}
                name={node.name}
                id={node.id}
                isCurrent={node.id === props.currentPokemonId}
                onPress={() => props.onPokemonPress(node.id)}
                variant='linear'
              />
              
              {index < flattenLinearChain(rootNode).length - 1 && <RightArrow />}
            </XStack>
          ))}
        </XStack>
      )}
    </YStack>
  )
}
