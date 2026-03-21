import { Bookmark, BookmarkCheck } from '@tamagui/lucide-icons'
import { Button, ButtonProps, GetThemeValueForKey, useTheme } from 'tamagui'

interface BookmarkButtonProps extends ButtonProps {
  isBookmarked: boolean
}

export default function BookmarkButton({
  isBookmarked,
  ...buttonProps
}: BookmarkButtonProps) {
  const theme = useTheme()

  const shadowColor = (
    theme.shadowColor?.val || 'rgba(0, 0, 0, 0.1)'
  ) as GetThemeValueForKey<"backgroundColor">

  return (
    <Button
      circular
      elevate
      icon={isBookmarked ? BookmarkCheck : Bookmark}
      color={theme.text.val}
      shadowColor={shadowColor}
      shadowOpacity={0.3}
      shadowRadius={8}
      {...buttonProps}
    />
  )
}

