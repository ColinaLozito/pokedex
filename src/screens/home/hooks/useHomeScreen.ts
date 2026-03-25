import { useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { useHomeData } from './useHomeData'
import type { UseHomeScreenReturn } from '../types'

export function useHomeScreen(): UseHomeScreenReturn {
  const router = useRouter()
  const { data, actions } = useHomeData()

  const handleTypeSelect = useCallback((typeId: number, typeName: string) => {
    router.push({
      pathname: '/typeFilterV2',
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
