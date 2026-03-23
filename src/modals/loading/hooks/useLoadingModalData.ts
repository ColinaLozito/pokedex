import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useModalStore } from '@/store/modalStore'
import type { LoadingModalProps } from '@/store/types/modal'
import type { UseLoadingModalDataReturn } from '../types'

export function useLoadingModalData(): UseLoadingModalDataReturn {
  const { type, props, closeModal } = useModalStore(
    useShallow(s => ({
      type: s.type,
      props: s.props,
      closeModal: s.closeModal,
    }))
  )

  const loadingProps = useMemo((): LoadingModalProps | null => {
    if (type !== 'loading' || !props) return null
    if (props && 'message' in props) return props as LoadingModalProps
    return null
  }, [type, props])

  const actions = useMemo(() => ({
    closeModal,
  }), [closeModal])

  return {
    data: { modalType: type, loadingProps },
    actions,
  }
}
