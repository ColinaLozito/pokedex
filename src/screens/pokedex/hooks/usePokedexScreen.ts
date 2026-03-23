import { useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { usePokedexData } from './usePokedexData'
import type { UsePokedexScreenReturn } from '../types'

export function usePokedexScreen(): UsePokedexScreenReturn {
  const router = useRouter()
  const { data, actions } = usePokedexData()

  const handleTypeSelect = useCallback((typeId: number, typeName: string) => {
    router.push({
      pathname: '/typeFilter',
      params: {
        typeId: typeId.toString(),
        typeName: typeName,
      },
    })
  }, [router])

  const dataMemo = useMemo(() => data, [data])

  const actionsMemo = useMemo(() => ({
    ...actions,
    handleTypeSelect,
  }), [actions, handleTypeSelect])

  return {
    data: dataMemo,
    actions: actionsMemo,
  }
}
