import { useEffect, useRef, useState } from 'react'
import { Text, useTheme, YStack } from 'tamagui'

interface NumberRouletteProps {
  onComplete: (finalNumber: number) => void
  duration?: number // Duration in milliseconds (default 3000ms = 3 seconds)
  min?: number // Minimum number (default 1)
  max?: number // Maximum number (default 1000)
  start?: boolean // Whether to start spinning
}

export default function NumberRoulette({ 
  onComplete, 
  duration = 3000,
  min = 1,
  max = 1000,
  start = true
}: NumberRouletteProps) {
  const theme = useTheme()
  const [currentNumber, setCurrentNumber] = useState<number>(min)
  const [isSpinning, setIsSpinning] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isSpinningRef = useRef(false)
  
  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  
  useEffect(() => {
    if (!start) {
      // Clean up if start becomes false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (isSpinningRef.current) {
        isSpinningRef.current = false
        // Update state asynchronously to avoid synchronous setState in effect
        Promise.resolve().then(() => {
          setIsSpinning(false)
        })
      }
      return
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Start spinning asynchronously
    isSpinningRef.current = true
    Promise.resolve().then(() => {
      setIsSpinning(true)
      setCurrentNumber(min)
      startTimeRef.current = Date.now()
      
      const spin = () => {
        if (!startTimeRef.current || !isSpinningRef.current) return
        
        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        
        if (progress >= 1) {
          // Animation complete - select final random number
          const finalNumber = Math.floor(Math.random() * (max - min + 1)) + min
          setCurrentNumber(finalNumber)
          isSpinningRef.current = false
          setIsSpinning(false)
          onCompleteRef.current(finalNumber)
        } else {
          // During animation - show random numbers
          // Slow down as we approach the end (ease-out effect)
          const easeOut = 1 - Math.pow(1 - progress, 3)
          const updateInterval = Math.max(10, 50 * (1 - easeOut * 0.8)) // Slower updates near the end
          
          const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
          setCurrentNumber(randomNumber)
          
          timeoutRef.current = setTimeout(spin, updateInterval)
        }
      }
      
      // Start spinning
      spin()
    })
    
    return () => {
      isSpinningRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [start, duration, min, max])
  
  return (
    <YStack
      items='center'
      justify='center'
      p={32}
      bg={theme.gray2?.val || '#F5F5F5'}
      borderRadius={16}
      minHeight={150}
      width='100%'
      borderWidth={2}
      borderColor={theme.border?.val || '#E0E0E0'}
    >
      <Text
        fontSize={56}
        fontWeight={900}
        color={theme.text?.val || '#333333'}
        letterSpacing={6}
      >
        #{String(currentNumber).padStart(4, '0')}
      </Text>
      {isSpinning && (
        <Text
          fontSize={20}
          color={theme.gray10?.val || '#666666'}
          mt={12}
          fontWeight={600}
        >
          Spinning...
        </Text>
      )}
    </YStack>
  )
}

