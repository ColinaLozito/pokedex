import { useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import type { UseLoadingModalScreenReturn } from '../types'
import { useLoadingModalData } from './useLoadingModalData'

export function useLoadingModalScreen(): UseLoadingModalScreenReturn {
  const router = useRouter()
  const { data, actions } = useLoadingModalData()

  const message = data.loadingProps?.message || 'Loading...'

  const dismiss = useCallback(() => {
    actions.closeModal()
    try {
      router.back()
    } catch {
      // Modal may not be present in stack
    }
  }, [actions.closeModal, router])

  const dataMemo = useMemo(() => ({
    loadingProps: data.loadingProps,
    message,
  }), [data.loadingProps, message])

  const actionsMemo = useMemo(() => ({
    closeModal: actions.closeModal,
    dismiss,
  }), [actions.closeModal, dismiss])

  return {
    data: dataMemo,
    actions: actionsMemo,
  }
}
