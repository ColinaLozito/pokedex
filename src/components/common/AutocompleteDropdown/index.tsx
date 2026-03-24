import { baseColors } from '@theme/colors';
import { useCallback, useMemo } from 'react';
import { AutocompleteDropdown as Autocomplete, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import type { AutocompleteDropdownProps } from './types';

export const AutocompleteDropdown = ({ onSelectItem, dataSet }: AutocompleteDropdownProps) => {
  
  const handleSelectItem = useCallback((item: AutocompleteDropdownItem | null) => {
    // Only trigger if item is valid and has an ID
    if (!item || !item.id) return
    
    const id = parseInt(item.id, 10)
    if (id > 0) {
      onSelectItem(id)
    }
  }, [onSelectItem])
  
  const inputContainerStyle = useMemo(() => ({
    backgroundColor: baseColors.white,
    borderColor: baseColors.text,
    borderWidth: 2,
  }), [])
  
  const textInputProps = useMemo(() => ({
    style: {
      color: baseColors.text,
    },
    placeholderTextColor: baseColors.doveGray,
  }), [])
  
  const suggestionsListContainerStyle = useMemo(() => ({
    top: -60,
  }), [])
  
  return (
    <Autocomplete
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
