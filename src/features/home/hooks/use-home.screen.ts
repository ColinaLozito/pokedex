import { useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { useHomeData } from './use-home.data'
import type { UseHomeScreenReturn } from '../home.types'

export function useHomeScreen(): UseHomeScreenReturn {
  const router = useRouter()
  const { data, actions } = useHomeData()

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
