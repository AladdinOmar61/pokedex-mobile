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

  const menuPan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevOptionYpos.value = optionYpos.value
    })
    .onUpdate((event) => {
      optionYpos.value = clamp(
        prevOptionYpos.value + event.translationY,
        0,
        tabHeight 
      );
    })
    .onEnd((event) => {
    // use swipe speed to determine position
    const velocityThreshold = 500;
    
    if (event.velocityY < -velocityThreshold) {
      // Snap to show options when fast swipe up
      optionYpos.value = withSpring(0);
    } else if (event.velocityY > velocityThreshold) {
      // Snap to tabheight when fast swipe down
      optionYpos.value = withSpring(tabHeight);
    } else {
      // Something weird happened? Determine its
      // position and move it based on the thresholds below
      const snapToTop = optionYpos.value < tabHeight / 2;
      optionYpos.value = withSpring(snapToTop ? 0 : tabHeight);
    }
    })

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
