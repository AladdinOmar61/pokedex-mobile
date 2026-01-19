import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import React from "react";
import FilterIcon from "@/assets/Icons/FilterIcon.svg";
import SearchIcon from "@/assets/Icons/SearchIcon.svg";
import SortIcon from "@/assets/Icons/SortIcon.svg";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const BottomOptions = () => {
  const { width, height } = useWindowDimensions();
  const tabHeight = height / 2 - height / 10;
  const prevOptionYpos = useSharedValue<number>(tabHeight);
  const optionYpos = useSharedValue<number>(tabHeight);
  const offset = useSharedValue<number>(tabHeight);
  const pressed = useSharedValue(false);

  const menuPan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevOptionYpos.value = optionYpos.value;
    })
    .onUpdate((event) => {
      optionYpos.value = event.translationY;
    })
    .onEnd(() => {
      if (optionYpos.value > tabHeight) {
        optionYpos.value = withSpring(-(height / 2 - tabHeight * 1.25));
      } else {
        optionYpos.value = withSpring(tabHeight);
      }
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: optionYpos.value }],
  }));

  return (
    <GestureDetector gesture={menuPan}>
      <Animated.View
        style={[
          styles.options,
          {
            height: height / 2,
            width: width,
          },
          animatedStyles,
        ]}
      >
        <View style={styles.icons}>
          <SearchIcon width={30} height={30} />
          <FilterIcon width={30} height={30} />
          <SortIcon width={30} height={30} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  options: {
    zIndex: 1000,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#F4511E",
  },
  icons: {
    position: "absolute",
    top: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default BottomOptions;
