import { useEffect, useRef, useState } from 'react'
import { Text, YStack, useTheme } from 'tamagui'

interface NumberRouletteProps {
  onComplete: (finalNumber: number) => void
  duration?: number // Duration in milliseconds (default 3000ms = 3 seconds)
  min?: number // Minimum number (default 1)
  max?: number // Maximum number (default 1000)
  start?: boolean // Whether to start spinning
  finalNumber?: number // Target number to stop at (optional, defaults to random)
}

export default function NumberRoulette({ 
  onComplete, 
  duration = 3000,
  min = 1,
  max = 1000,
  start = true,
  finalNumber,
}: NumberRouletteProps) {
  const theme = useTheme()
  const [currentNumber, setCurrentNumber] = useState<number>(min)
  const [isShuffling, setIsShuffling] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isShufflingRef = useRef(false)
  const finalNumberRef = useRef<number | undefined>(finalNumber)
  
  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  
  useEffect(() => {
    finalNumberRef.current = finalNumber
  }, [finalNumber])
  
  useEffect(() => {
    if (!start) {
      // Clean up if start becomes false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (isShufflingRef.current) {
        isShufflingRef.current = false
        Promise.resolve().then(() => {
          setIsShuffling(false)
        })
      }
      return
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Initialize animation
    const initializeAnimation = () => {
      setIsShuffling(true)
      setCurrentNumber(min)
      startTimeRef.current = Date.now()
      
      // Determine target number (use provided or generate random)
      const targetNumber = (finalNumberRef.current 
        || Math.floor(Math.random() * (max - min + 1)) + min)
      
      // Animation loop function
      const animate = () => {
        // Safety check: stop if animation was cancelled
        if (!startTimeRef.current || !isShufflingRef.current) {
          return
        }
        
        const now = Date.now()
        const elapsed = now - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1) // 0 to 1
        
        // Check if animation is complete
        if (progress >= 1) {
          // Show final number
          setCurrentNumber(targetNumber)
          isShufflingRef.current = false
          setIsShuffling(false)
          
          // Call onComplete after 1 second delay
          timeoutRef.current = setTimeout(() => {
            onCompleteRef.current(targetNumber)
            timeoutRef.current = null
          }, 1000)
          return
        }
        
        // Still animating - show random number
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
        setCurrentNumber(randomNumber)
        
        // Calculate next update interval (slower near the end for ease-out effect)
        const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out: 0 to 1
        const baseInterval = 50 // Base update interval in ms
        const slowestInterval = 10 // Slowest update interval
        const updateInterval = Math.max(slowestInterval, baseInterval * (1 - easeOut * 0.8))
        
        // Schedule next animation frame
        timeoutRef.current = setTimeout(animate, updateInterval)
      }
      
      // Start the animation
      animate()
    }
    
    // Start animation asynchronously (avoids synchronous setState in effect)
    isShufflingRef.current = true
    Promise.resolve().then(initializeAnimation)
    
    // Cleanup function
    return () => {
      isShufflingRef.current = false
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
      {isShuffling && (
        <Text
          fontSize={20}
          color={theme.gray10?.val || '#666666'}
          mt={12}
          fontWeight={600}
        >
          Shuffling
        </Text>
      )}
    </YStack>
  )
}

