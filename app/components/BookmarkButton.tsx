import { Bookmark, BookmarkCheck } from '@tamagui/lucide-icons'
import { Button, GetThemeValueForKey, useTheme } from 'tamagui'

interface BookmarkButtonProps {
  isBookmarked: boolean
  onPress: () => void
  size?: number
  scaleIcon?: number
  backgroundColor?: string
  opacity?: number
  position?: 'absolute' | 'relative'
  right?: number
  bottom?: number
  left?: number
  top?: number
  disabled?: boolean
}

export default function BookmarkButton({
  isBookmarked,
  onPress,
  size = 68,
  scaleIcon = 1,
  backgroundColor,
  opacity = 1,
  position,
  right,
  bottom,
  left,
  top,
  disabled = false,
}: BookmarkButtonProps) {
  const theme = useTheme()

  const shadowColor = (
    theme.shadowColor?.val || 'rgba(0, 0, 0, 0.1)'
  ) as GetThemeValueForKey<"backgroundColor">

  return (
    <Button
      size={size}
      circular
      elevate
      icon={isBookmarked ? BookmarkCheck : Bookmark}
      onPress={onPress}
      disabled={disabled}
      color={theme.text.val}
      scaleIcon={scaleIcon}
      shadowColor={shadowColor}
      shadowOpacity={0.3}
      shadowRadius={8}
      opacity={opacity}
      position={position}
      right={right}
      bottom={bottom}
      left={left}
      top={top}
      style={
        backgroundColor
          ? { backgroundColor }
          : undefined
      }
    />
  )
}

