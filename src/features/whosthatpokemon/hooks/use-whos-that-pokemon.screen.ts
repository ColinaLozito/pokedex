import { useCallback, useEffect, useMemo } from 'react'
import { useModal } from '@/shared/hooks/useModal'
import { toast } from '@/shared/utils/tamaguiToast'
import { getPokemonSpriteUrl } from '@/utils/pokemon/sprites'
import { useWhosThatPokemonGame } from './use-whos-that-pokemon.hook'
import { useRoundNames } from './use-round-names.hook'
import type { WhosThatPokemonReturn } from '../whos-that-pokemon.types'

function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function useWhosThatPokemonScreen(): WhosThatPokemonReturn {
  const { round, generateNewRound, handleSelect: handleGameSelect } = useWhosThatPokemonGame()
  const { names, isLoading, errorMessage } = useRoundNames(round?.ids ?? null)
  const { showLoading, dismiss } = useModal()

  useEffect(() => {
    if (isLoading) {
      showLoading('Loading Pokémon...')
    } else {
      dismiss()
    }
  }, [isLoading, showLoading, dismiss])

  useEffect(() => {
    if (errorMessage) {
      toast.error('Failed to load Pokémon', { description: 'Tap to retry' })
    }
  }, [errorMessage])

  const correctName = names ? names[round?.correctIndex ?? 0] : ''
  const pokemonId = round ? round.ids[round.correctIndex] : 0
  const spriteUrl = useMemo(() => getPokemonSpriteUrl(pokemonId), [pokemonId])

  const options = useMemo(() => {
    if (!names) return []
    return fisherYatesShuffle(names)
  }, [names])

  const handleSelect = useCallback(
    (name: string) => {
      handleGameSelect(name, correctName)
    },
    [handleGameSelect, correctName],
  )

  const handleNext = useCallback(() => {
    generateNewRound()
  }, [generateNewRound])

  const retry = useCallback(() => {
    generateNewRound()
  }, [generateNewRound])

  const isResolving = isLoading || round === null || names === null

  return {
    pokemonId,
    spriteUrl,
    options,
    correctName,
    status: round?.status ?? 'playing',
    selectedOption: round?.selectedOption ?? null,
    isLoading: isResolving,
    error: errorMessage,
    handleSelect,
    handleNext,
    retry,
  }
}
