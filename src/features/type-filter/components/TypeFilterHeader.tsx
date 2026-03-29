import { H2, Image, XStack } from 'tamagui'
import { TypeFilterHeaderProps } from '../type-filter.types'

export default function TypeFilterHeader({ typeName, typeIcon }: TypeFilterHeaderProps) {
  return (
    <XStack
      gap={12}
      alignItems="center"
      px={16}
      pb={12}
    >
      <XStack flex={1} alignItems="center" justifyContent="center">
        <H2
          color="white"
          textTransform="capitalize"
          fontWeight="$8"
        >
          {typeName}
        </H2>
        {typeIcon && (
          <Image
            src={typeIcon as string}
            position="absolute"
            right={-90}
            width={200}
            height={200}
            zIndex={-1}
            objectFit="contain"
          />
        )}
      </XStack>
    </XStack>
  )
}
