import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React from 'react'
import FilterIcon from '@/assets/Icons/FilterIcon.svg';
import SearchIcon from '@/assets/Icons/SearchIcon.svg';
import SortIcon from '@/assets/Icons/SortIcon.svg';
import Animated, { useSharedValue } from 'react-native-reanimated';

const BottomOptions = () => {

  const { width, height } = useWindowDimensions();
  const optionXpos = useSharedValue(height / 10);

  const handlePress = () => {
    //TODO: figure out the math behind calculating x-shift distance for menu
    optionXpos.value = optionXpos.value + ((height / 2) % height);
  }

  return (
    <Animated.View style={[styles.options, { height: optionXpos, width: width }]}>
      <View style={styles.icons}>
        <Pressable onPress={handlePress}>
        <SearchIcon width={30} height={30} />
        </Pressable>
        <FilterIcon width={30} height={30} />
        <SortIcon width={30} height={30} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  options: {
    zIndex: 1000,
    position: 'absolute',
    bottom: 0,
    backgroundColor: "#F4511E",
  },
  icons: {
    position: 'absolute',
    top: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }

})

export default BottomOptions