import { useEffect } from 'react'
import { RelativePathString, useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/screens/home' as RelativePathString)
  }, [router])

  return null
}

