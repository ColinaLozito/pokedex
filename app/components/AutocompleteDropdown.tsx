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
        onSelectItem(parseInt(item?.id ?? '0', 10));
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
        suggestionsListContainerStyle={{
          top: -60,
        }}
      />
    )
}