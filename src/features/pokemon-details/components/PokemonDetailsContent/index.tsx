import TypeChips from '@/shared/components/pokemon/PokemonTypeChips'
import { XStack, YStack } from 'tamagui'
import type { PokemonDetailsContentProps } from '../../details.types'
import EvolutionChain from './_parts/EvolutionChain'
import PokemonAbilities from './_parts/PokemonAbilities'
import PokemonAttributes from './_parts/PokemonAttributes'
import PokemonBaseStats from './_parts/PokemonBaseStats'

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
      <XStack justifyContent="center" alignItems="center" width="100%" mb="$2">
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
