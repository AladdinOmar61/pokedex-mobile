import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useAtom } from 'jotai';
import { searchAtom } from '@/atoms';

const SearchField = () => {

    const [searchText, setSearchText] = useAtom(searchAtom);

  return (
      <View style={{width: '100%', height: '100%'}}>
          <TextInput
              style={{ backgroundColor: 'white', width: '90%', marginHorizontal: 'auto', height: '95%', fontFamily: 'Silkscreen', paddingLeft: 5 }}
              onChangeText={setSearchText}
              value={searchText}
          />
          {searchText.length === 0 &&
              <Text style={{ position: 'absolute', top: 11, left: 20, fontFamily: 'Silkscreen', fontSize: 13, opacity: 0.7 }}>Search pokemon by name</Text>
          }
      </View>
  )
}

export default SearchField