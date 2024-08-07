import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const BottomSheetModal = ({ isVisible, onClose, children }) => {
  const insets = useSafeAreaInsets();
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(panY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(panY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > contentHeight / 3) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        styles.overlay,
        { opacity: fadeAnim }
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateY }],
            paddingBottom: insets.bottom + 8, // Adding bottom inset and margin
            marginHorizontal: 16, // Matching StoryItemView horizontal margin
          },
        ]}
      >
        <View 
          style={styles.background}
          onLayout={(event) => {
            setContentHeight(event.nativeEvent.layout.height);
          }}
        >
          <View {...panResponder.panHandlers} style={styles.draggableArea}>
            <View style={styles.draggableIcon} />
          </View>
          <TouchableWithoutFeedback>
            <View style={styles.content}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  background: {
    backgroundColor: '#1F2937',
    borderRadius: 24, // Matching StoryItemView border radius
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  draggableArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  draggableIcon: {
    width: 40,
    height: 5,
    backgroundColor: '#9CA3AF',
    borderRadius: 3,
  },
  content: {
    padding: 20,
  },
});

export default BottomSheetModal;