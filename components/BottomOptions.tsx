import { View, StyleSheet, useWindowDimensions, Pressable, Text, TextInput } from "react-native";
import React from "react";
import FilterIcon from "@/assets/Icons/FilterIcon.svg";
import SortIcon from "@/assets/Icons/SortIcon.svg";
import SettingsIcon from "@/assets/Icons/SettingsIcon.svg";
import MenuArrow from "@/assets/Icons/MenuArrow.svg";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const BottomOptions = () => {
  const { width, height } = useWindowDimensions();
  const tabHeight = height / 2 - height / 10;
  const prevOptionYpos = useSharedValue<number>(tabHeight);
  const optionYpos = useSharedValue<number>(tabHeight);
  const optionOpen = useSharedValue<boolean>(false);

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
        optionOpen.value = true;
      } else if (event.velocityY > velocityThreshold) {
        // Snap to tabheight when fast swipe down
        optionYpos.value = withSpring(tabHeight);
        optionOpen.value = false;
      } else {
        // Something weird happened? Unexpected behavior? Determines its
        // position and move it based on the thresholds below
        const snapToTop = optionYpos.value < tabHeight / 2;
        optionYpos.value = withSpring(snapToTop ? 0 : tabHeight);
        optionOpen.value = snapToTop ? true : false;
      }
    })

  const animatedMenuStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: optionYpos.value }],
  }));

  const animatedArrowStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: optionOpen.value ? withSpring('180deg') : withSpring('0deg') }]
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
          animatedMenuStyles,
        ]}
        >
        <View style={styles.menuArea}>
          <View style={styles.menuArrowView}>
            <Animated.View style={animatedArrowStyles}>
              <MenuArrow />
            </Animated.View>
          </View>
          <View style={styles.icons}>
            <SettingsIcon width={25} height={25} />
            <FilterIcon width={25} height={25} />
            <SortIcon width={25} height={25} />
          </View>
        </View>
        </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  menuArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuArrowView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  options: {
    zIndex: 1000,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#F4511E",
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderStyle: 'solid'
  },
  icons: {
    position: "absolute",
    top: 17,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  infoText: {
    fontFamily: "Silkscreen",
    color: 'white'
  },
});

export default BottomOptions;
