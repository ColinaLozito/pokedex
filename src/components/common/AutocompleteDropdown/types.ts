export type AutocompleteDropdownProps = {
  onSelectItem: (id: number) => void
  dataSet: { id: string; title: string }[]
}
