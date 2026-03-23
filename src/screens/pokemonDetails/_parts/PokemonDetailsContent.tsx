import EvolutionChain from '@/components/pokemon/EvolutionChain'
import PokemonAbilities from '@/components/pokemon/PokemonAbilities'
import PokemonAttributes from '@/components/pokemon/PokemonAttributes'
import PokemonBaseStats from '@/components/pokemon/PokemonBaseStats'
import TypeChips from '@/components/pokemon/PokemonTypeChips'
import type { CombinedPokemonDetail } from 'src/services/types'
import { XStack, YStack } from 'tamagui'
import type { PokemonDetailsContentProps } from '../types'

export default function PokemonDetailsContent({
  pokemon,
  primaryTypeColor,
  onEvolutionPress,
  getPokemonDetail,
}: PokemonDetailsContentProps) {
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

      {pokemon.evolutionChain && pokemon.evolutionChain.length > 1 && pokemon.evolutionChainTree && (
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
