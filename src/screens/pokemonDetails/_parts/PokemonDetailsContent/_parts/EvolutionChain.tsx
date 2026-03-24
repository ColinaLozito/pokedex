import RightArrow from '@/components/common/RightArrow/RightArrow'
import { EvolutionChainProps } from '@/screens/pokemonDetails/types'
import {
  buildEvolutionTree,
  collectEvolutionVariants,
  flattenLinearChain,
  isBranchingEvolution
} from '@/utils/evolutionTree'
import { getPokemonSprite } from '@/utils/pokemonSprites'
import { H4, XStack, YStack } from 'tamagui'
import EvolutionSpriteContainer from './EvolutionSpriteContainer'

export default function EvolutionChain(props: EvolutionChainProps) {
  const rootNode = buildEvolutionTree(props.evolutionChainTree)
  const isBranching = isBranchingEvolution(props.evolutionChainTree)
  const variants = collectEvolutionVariants(rootNode)
  return (
    <YStack width='100%'>
      <H4 mb="$5" text='center' color="$text">Evolution</H4>
      
      {isBranching ? (
       <YStack items='center' gap="$1" width='100%'>
       <EvolutionSpriteContainer
         sprite={getPokemonSprite(props.getPokemonDetail?.(rootNode.id), rootNode.id)}
         name={rootNode.name}
         id={rootNode.id}
         isCurrent={rootNode.id === props.currentPokemonId}
         onPress={() => props.onPokemonPress(rootNode.id)}
         variant='branching-initial'
       />
       
       {variants.length > 0 && (
         <XStack flexWrap='wrap' justify='center' width='100%'>
           {variants.map((variant, index) => (
             <YStack key={`${variant.id}-${index}`} width='30%' items='center'>
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
        <XStack items='center' justify='center' flexWrap='wrap' gap="$1">
          {flattenLinearChain(rootNode).map((node, index) => (
            <XStack key={`${node.id}-${index}`} items='center'>
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
