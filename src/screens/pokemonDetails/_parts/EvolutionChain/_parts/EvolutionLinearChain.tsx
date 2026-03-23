import EvolutionSpriteContainer from '../../EvolutionSpriteContainer'
import { getPokemonSprite } from 'src/utils/pokemonSprites'
import { XStack } from 'tamagui'
import type { EvolutionLinearChainProps } from '../types'
import EvolutionArrow from './EvolutionArrow'

export default function EvolutionLinearChain({
  nodes,
  currentPokemonId,
  onPokemonPress,
  getPokemonDetail,
}: EvolutionLinearChainProps) {
  return (
    <XStack items='center' justify='center' flexWrap='wrap' gap="$1">
      {nodes.map((node, index) => (
        <XStack key={`${node.id}-${index}`} items='center'>
          <EvolutionSpriteContainer
            sprite={getPokemonSprite(getPokemonDetail?.(node.id), node.id)}
            name={node.name}
            id={node.id}
            isCurrent={node.id === currentPokemonId}
            onPress={() => onPokemonPress(node.id)}
            variant='linear'
          />
          
          {index < nodes.length - 1 && <EvolutionArrow />}
        </XStack>
      ))}
    </XStack>
  )
}
