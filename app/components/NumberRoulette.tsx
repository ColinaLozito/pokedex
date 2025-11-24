import { useEffect, useState, useRef } from 'react'
import { Text, YStack } from 'tamagui'

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
  const [currentNumber, setCurrentNumber] = useState<number>(min)
  const [isSpinning, setIsSpinning] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  
  useEffect(() => {
    console.log('[ROULETTE] Effect triggered, start:', start)
    
    if (!start) {
      setIsSpinning(false)
      return
    }
    
    // Reset state
    setIsSpinning(true)
    setCurrentNumber(min)
    startTimeRef.current = Date.now()
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    const spin = () => {
      if (!startTimeRef.current) return
      
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      if (progress >= 1) {
        // Animation complete - select final random number
        const finalNumber = Math.floor(Math.random() * (max - min + 1)) + min
        console.log('[ROULETTE] Complete! Final number:', finalNumber)
        setCurrentNumber(finalNumber)
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
    
    // Start immediately
    spin()
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [start, duration, min, max])
  
  return (
    <YStack
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        minHeight: 150,
        width: '100%',
        borderWidth: 2,
        borderColor: '#E0E0E0',
      }}
    >
      <Text
        fontSize={56}
        fontWeight="900"
        color="#333333"
        style={{
          fontFamily: 'monospace',
          letterSpacing: 6,
          textAlign: 'center',
        }}
      >
        #{String(currentNumber).padStart(4, '0')}
      </Text>
      {isSpinning && (
        <Text
          fontSize={20}
          color="#666666"
          style={{ marginTop: 12, fontWeight: '600' }}
        >
          Spinning...
        </Text>
      )}
    </YStack>
  )
}

