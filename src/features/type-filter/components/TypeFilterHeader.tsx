import { H5, Image, XStack } from 'tamagui'
import { TypeFilterHeaderProps } from '../type-filter.types'

export default function TypeFilterHeader({ typeName, typeIcon }: TypeFilterHeaderProps) {
  return (
    <XStack
      gap={12}
      alignItems="center"
      px={16}
    >
      <XStack flex={1} alignItems="center" justifyContent="center">
        <H5
          color="black"
          textTransform="capitalize"
          fontWeight="$8"
        >
          {typeName}
        </H5>
        {typeIcon && (
          <Image
            src={typeIcon as string}
            position="absolute"
            right={0}
            width="$10"
            height="$10"
            zIndex={-1}
            objectFit="contain"
          />
        )}
      </XStack>
    </XStack>
  )
}
