import { baseColors } from '@theme/colors'
import { useCallback, useMemo } from 'react'
import { AutocompleteDropdown as Autocomplete, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown'
import type { ViewStyle } from 'react-native'
import { AutocompleteDropdownProps } from './types'

export const AutocompleteDropdown = ({ 
  onSelectItem, 
  dataSet = [],
  onChangeText,
  loading = false,
  showError = false,
}: AutocompleteDropdownProps) => {
  
  const handleSelectItem = useCallback((item: AutocompleteDropdownItem | null) => {
    if (!item || !item.id) return
    
    const id = parseInt(item.id, 10)
    if (id > 0) {
      onSelectItem(id)
    }
  }, [onSelectItem])

  const handleChangeText = useCallback((text: string) => {
    if (onChangeText) {
      onChangeText(text)
    }
  }, [onChangeText])
  
  const inputContainerStyle = useMemo((): ViewStyle => ({
    backgroundColor: baseColors.white,
    borderColor: showError ? baseColors.red : baseColors.text,
    borderWidth: 2,
  }), [showError])
  
  const textInputProps = useMemo(() => ({
    style: {
      color: baseColors.text,
    },
    placeholderTextColor: baseColors.doveGray,
  }), [])

  const suggestionsListContainerStyle = useMemo(() => ({
    top: -60,
  }), [])

  const dataSetToPass = loading ? [] : dataSet
  
  return (
    <Autocomplete
      clearOnFocus={true}
      closeOnBlur={true}
      closeOnSubmit={false}
      onSelectItem={handleSelectItem}
      onChangeText={handleChangeText}
      dataSet={dataSetToPass}
      suggestionsListMaxHeight={200}
      inputContainerStyle={inputContainerStyle}
      textInputProps={textInputProps}
      suggestionsListContainerStyle={suggestionsListContainerStyle}
      loading={loading}
    />
  )
}