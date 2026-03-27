// Better type definitions for React Native/Expo assets
declare module '*.png' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.jpg' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.jpeg' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.gif' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.webp' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.svg' {
  const value: number // SVG imports return a number (require() result)
  export default value
}

declare module '*.ttf' {
  const value: number // Font imports return a number (require() result)
  export default value
}

declare module '*.otf' {
  const value: number
  export default value
}

declare module '*.woff' {
  const value: number
  export default value
}

declare module '*.woff2' {
  const value: number
  export default value
}

declare module '*.eot' {
  const value: number
  export default value
}

declare module '@tamagui/font-inter/otf/*' {
  const value: number
  export default value
}

