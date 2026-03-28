import TypeChips from '../../PokemonTypeChips'
import { Text, XStack } from 'tamagui'
import { POKEMON_CARD_COLORS } from '../constants'
import { PokemonCardTypesProps } from '../types'

export default function PokemonCardTypes({ types, primaryType }: PokemonCardTypesProps) {
  if (types && types.length > 0) {
    return (
      <XStack mt={8}>
        <TypeChips types={types} size="small" gap="$1" />
      </XStack>
    )
  }

  if (primaryType) {
    return (
      <XStack mt={8}>
        <TypeChips types={[{ slot: 1, type: { name: primaryType } }]} size="small" gap="$1" />
      </XStack>
    )
  }

  // fallback for missing type data
  return (
    <XStack mt="$3" justify="center">
      <Text fontSize="$4" fontWeight="$7" color={POKEMON_CARD_COLORS.mutedText}>??</Text>
    </XStack>
  )
}
