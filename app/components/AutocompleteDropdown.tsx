//...
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown'
import { useTheme } from 'tamagui';

//...

interface AutocompleteDropdownProviderProps {
    onSelectItem: (id: number) => void;
    dataSet: { id: string; title: string }[];
}

export default function AutocompleteDropdownList({ onSelectItem, dataSet }: AutocompleteDropdownProviderProps) {
    const theme = useTheme()
    const handleSelectItem = (item: AutocompleteDropdownItem | null) => {
        // Only trigger if item is valid and has an ID
        if (!item || !item.id) {
            return
        }
        
        const id = parseInt(item.id, 10)
        if (id > 0) {
            onSelectItem(id)
        }
    }
    
    return (
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        onSelectItem={handleSelectItem}
        dataSet={dataSet}
        suggestionsListMaxHeight={200}
        inputContainerStyle={{
          backgroundColor: theme.background.val,
          borderColor: theme.border.val,
          borderWidth: 1,
        }}
        textInputProps={{
          style: {
            color: theme.text.val,
          },
          placeholderTextColor: theme.gray10?.val || '#737373',
        }}
        suggestionsListContainerStyle={{
          top: -60,
        }}
      />
    )
}