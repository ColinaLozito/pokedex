import * as React from 'react'
import { XStack, Text } from 'tamagui'
import TypeChips from '../../TypeChips'
import { PokemonCardTypesProps } from '../types'
import { POKEMON_CARD_COLORS } from '../constants'

export default function PokemonCardTypes({ types }: PokemonCardTypesProps) {
  return (
    types && types.length > 0 ? (
      <XStack mt={8}>
        <TypeChips types={types} size="small" gap={6} />
      </XStack>
    ) : (
      <XStack mt={8} ml={24}>
        <Text fontSize={24} color={POKEMON_CARD_COLORS.mutedText}>??</Text>
      </XStack>
    )
  )
}
