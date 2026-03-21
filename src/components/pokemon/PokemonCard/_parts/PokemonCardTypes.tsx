import { Text, XStack } from 'tamagui'
import TypeChips from '../../PokemonTypeChips'
import { POKEMON_CARD_COLORS } from '../constants'
import { PokemonCardTypesProps } from '../types'

export default function PokemonCardTypes({ types }: PokemonCardTypesProps) {
  return (
    types && types.length > 0 ? (
      <XStack mt={8}>
        <TypeChips types={types} size="small" gap="$1" />
      </XStack>
    ) : (
      <XStack mt="$3" justify="center">
        <Text fontSize="$4" fontWeight="$7" color={POKEMON_CARD_COLORS.mutedText}>??</Text>
      </XStack>
    )
  )
}
