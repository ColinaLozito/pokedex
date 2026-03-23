import { useRouter } from 'expo-router'
import { usePokedexData } from './usePokedexData'
import type { UsePokedexScreenReturn } from '../types'

export function usePokedexScreen(): UsePokedexScreenReturn {
  const router = useRouter()

  const data = usePokedexData()

  const handleTypeSelect = (typeId: number, typeName: string) => {
    router.push({
      pathname: '/typeFilter',
      params: {
        typeId: typeId.toString(),
        typeName: typeName,
      },
    })
  }

  return {
    ...data,
    handleTypeSelect,
  }
}
