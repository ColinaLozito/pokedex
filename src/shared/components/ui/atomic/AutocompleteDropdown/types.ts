export type AutocompleteDropdownProps = {
  onSelectItem: (id: number) => void
  dataSet?: { id: string; title: string }[]
  onChangeText?: (text: string) => void
  loading?: boolean
  showError?: boolean
}