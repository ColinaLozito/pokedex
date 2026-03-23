export interface TypeGridItem {
  id: number
  name: string
}

export interface TypeGridProps {
  typeList: TypeGridItem[]
  onTypeSelect?: (typeId: number, typeName: string) => void
}

export interface TypeCardProps {
  type: TypeGridItem
  onPress: (typeId: number, typeName: string) => void
}
