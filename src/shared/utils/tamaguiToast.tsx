import type { ComponentType } from 'react'

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