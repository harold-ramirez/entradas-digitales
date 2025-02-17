import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Animated, Easing } from "react-native";

const { width, height } = Dimensions.get("window");
const frameSize = Math.min(width, height) * 0.7; 
const frameX = (width - frameSize) / 2;
const frameY = (height - frameSize) / 2;
const viewfinderSize = frameSize * 0.15; 

export const Overlay = () => {
  const animatedLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateScanner = () => {
      animatedLine.setValue(0);
      Animated.loop(
        Animated.timing(animatedLine, {
          toValue: frameSize,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    };
    animateScanner();
  }, [animatedLine]);

  return (
    <View style={styles.container}>
      
      <View style={styles.frame}>
        <View style={[styles.viewfinder, styles.topLeft]} />
        <View style={[styles.viewfinder, styles.topRight]} />
        <View style={[styles.viewfinder, styles.bottomLeft]} />
        <View style={[styles.viewfinder, styles.bottomRight]} />

        <Animated.View
          style={[styles.scannerLine, { transform: [{ translateY: animatedLine }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    position: "absolute",
    top: frameY,
    left: frameX,
    width: frameSize,
    height: frameSize,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  viewfinder: {
    width: viewfinderSize,
    height: viewfinderSize,
    borderColor: "#fff",
    position: "absolute",
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scannerLine: {
    position: "absolute",
    width: "90%",
    height: 3,
    backgroundColor: "red",
    borderRadius: 2,
    top: 0,
  },
});

