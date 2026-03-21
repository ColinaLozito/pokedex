export interface TypeGridItem {
  id: number
  name: string
}

export interface TypeGridProps {
  typeList: TypeGridItem[]
  onTypeSelect?: (typeId: number, typeName: string) => void
}
