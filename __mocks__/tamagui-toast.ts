import React from 'react'

export const Toast = {}
export const ToastProvider = ({ children }: { children: React.ReactNode }) => children
export const ToastViewport = () => null
export const ToastTitle = ({ children }: { children?: React.ReactNode }) => children
export const ToastDescription = ({ children }: { children?: React.ReactNode }) => children
export const useToastState = () => null
export const toast = {
  message: () => {},
  error: () => {},
  warning: () => {},
}