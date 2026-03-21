import { useCallback, useMemo } from 'react';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

interface AutocompleteDropdownProviderProps {
  onSelectItem: (id: number) => void
  dataSet: { id: string; title: string }[]
}

export default function AutocompleteDropdownList({
  onSelectItem,
  dataSet,
}: AutocompleteDropdownProviderProps) {
  
  const handleSelectItem = useCallback((item: AutocompleteDropdownItem | null) => {
    // Only trigger if item is valid and has an ID
    if (!item || !item.id) return
    
    const id = parseInt(item.id, 10)
    if (id > 0) {
      onSelectItem(id)
    }
  }, [onSelectItem])
  
  const inputContainerStyle = useMemo(() => ({
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])
  
  const textInputProps = useMemo(() => ({
    style: {
      color: '#333333',
    },
    placeholderTextColor: '#737373',
  }), [])
  
  const suggestionsListContainerStyle = useMemo(() => ({
    top: -60,
  }), [])
  
  return (
    <AutocompleteDropdown
      clearOnFocus={true}
      closeOnBlur={true}
      closeOnSubmit={false}
      onSelectItem={handleSelectItem}
      dataSet={dataSet}
      suggestionsListMaxHeight={200}
      inputContainerStyle={inputContainerStyle}
      textInputProps={textInputProps}
      suggestionsListContainerStyle={suggestionsListContainerStyle}
    />
  )
}