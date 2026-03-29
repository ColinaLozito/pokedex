import { Toast, ToastViewport, useToastState } from '@tamagui/toast'
import { YStack, Text } from 'tamagui'
import type { ComponentType } from 'react'

function ToastContent() {
  const toast = useToastState()
  
  if (!toast) return null
  
  return (
    <Toast>
      <YStack>
        <Text>{toast.title}</Text>
        {toast.message && <Text>{toast.message}</Text>}
      </YStack>
    </Toast>
  )
}

export const toast = {
  message: (title: string, data?: { description?: string }) => {
    console.log('Toast message:', title, data)
  },
  error: (title: string, data?: { description?: string }) => {
    console.log('Toast error:', title, data)
  },
  warning: (title: string, data?: { description?: string }) => {
    console.log('Toast warning:', title, data)
  },
}

export const Toaster: ComponentType<{
  position?: string
  offset?: number
  swipeDirection?: string
  duration?: number
  hotkey?: string[]
}> = () => null
