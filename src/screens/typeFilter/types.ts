import { ImageSourcePropType } from 'react-native'
import type { PokemonDisplayDataArray } from 'src/utils/getPokemonDisplayData'

export interface TypeFilterData {
  filteredData: PokemonDisplayDataArray
  loading: boolean
  error: string | null
  typeName: string
  typeColor: string
  typeIcon: ImageSourcePropType
  handleSelect: (id: number) => Promise<void>
}


export type TypeFilterHeaderProps = Pick<TypeFilterData, 'typeName' | 'typeIcon'>