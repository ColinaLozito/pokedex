import { XStack, YStack } from 'tamagui'
import TypeChips from '../../../components/pokemon/PokemonTypeChips'
import type { PokemonDetailsContentProps } from '../types'
import EvolutionChain from './EvolutionChain'
import PokemonAbilities from './PokemonAbilities'
import PokemonAttributes from './PokemonAttributes'
import PokemonBaseStats from './PokemonBaseStats'

export default function PokemonDetailsContent({
  pokemon,
  primaryTypeColor,
  onEvolutionPress,
  getPokemonDetail,
}: PokemonDetailsContentProps) {

  const hasEvolutionChain = 
    pokemon.evolutionChain && 
    pokemon.evolutionChain.length > 1 && 
    pokemon.evolutionChainTree

  return (
    <YStack
      bg="$white"
      marginTop="$4"
      gap="$2"
    >
      <XStack justify="center" items="center" width="100%" mb="$2">
        <TypeChips types={pokemon.types} size="medium" gap="$2" />
      </XStack>

      <PokemonAttributes
        species={pokemon.speciesInfo?.genus}
        height={pokemon.height}
        weight={pokemon.weight}
      />

      {hasEvolutionChain && (
        <YStack>
          <EvolutionChain
            evolutionChainTree={pokemon.evolutionChainTree}
            currentPokemonId={pokemon.id}
            onPokemonPress={onEvolutionPress}
            getPokemonDetail={getPokemonDetail}
          />
        </YStack>
      )}

      <PokemonBaseStats
        stats={pokemon.stats}
        primaryTypeColor={primaryTypeColor}
      />

      <PokemonAbilities abilities={pokemon.abilities} />
    </YStack>
  )
}
