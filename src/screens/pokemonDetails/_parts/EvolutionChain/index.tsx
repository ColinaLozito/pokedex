import EvolutionLinearChain from './_parts/EvolutionLinearChain'
import EvolutionBranchingChain from './_parts/EvolutionBranchingChain'
import { buildEvolutionTree, flattenLinearChain, isBranchingEvolution } from 'src/utils/evolutionTree'
import { H4, YStack } from 'tamagui'
import type { EvolutionChainProps } from './types'

export default function EvolutionChain(props: EvolutionChainProps) {
  const rootNode = buildEvolutionTree(props.evolutionChainTree)
  const isBranching = isBranchingEvolution(props.evolutionChainTree)

  return (
    <YStack width='100%'>
      <H4 mb="$5" text='center' color="$text">Evolution</H4>
      
      {isBranching ? (
        <EvolutionBranchingChain rootNode={rootNode} {...props} />
      ) : (
        <EvolutionLinearChain nodes={flattenLinearChain(rootNode)} {...props} />
      )}
    </YStack>
  )
}
