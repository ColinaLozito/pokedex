import { useCallback, useEffect, useRef, useState } from 'react'
import { ROUND_OPTIONS_COUNT, MAX_POKEMON_ID } from '../constants'
import { usePokemonGameStore } from '../store/use-pokemon-game-store'
import type { RoundState } from '../whos-that-pokemon.types'

function generateRandomIds(count: number, max: number): number[] {
  const ids: number[] = []
  const used = new Set<number>()
  while (ids.length < count) {
    const id = Math.floor(Math.random() * max) + 1
    if (!used.has(id)) {
      used.add(id)
      ids.push(id)
    }
  }
  return ids
}

interface UseWhosThatPokemonGameReturn {
  round: RoundState | null
  generateNewRound: () => void
  handleSelect: (selectedName: string, correctName: string) => void
}

export function useWhosThatPokemonGame(): UseWhosThatPokemonGameReturn {
  const recordGameOutcome = usePokemonGameStore((s) => s.recordGameOutcome)
  const [round, setRound] = useState<RoundState | null>(null)

  const generateNewRound = useCallback(() => {
    const ids = generateRandomIds(ROUND_OPTIONS_COUNT, MAX_POKEMON_ID)
    setRound({
      ids,
      correctIndex: Math.floor(Math.random() * ROUND_OPTIONS_COUNT),
      status: 'playing',
      selectedOption: null,
    })
  }, [])

  const isMountedRef = useRef(false)
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      generateNewRound()
    }
  }, [generateNewRound])

  const handleSelect = useCallback(
    (selectedName: string, correctName: string) => {
      const isCorrect = selectedName === correctName
      recordGameOutcome(isCorrect)
      setRound((prev) => {
        if (!prev || prev.status !== 'playing') return prev
        return {
          ...prev,
          selectedOption: selectedName,
          status: isCorrect ? 'correct' : 'incorrect',
        }
      })
    },
    [recordGameOutcome],
  )

  return { round, generateNewRound, handleSelect }
}
