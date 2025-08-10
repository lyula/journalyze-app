import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, View, StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAG_DISMISS_THRESHOLD = 120;

export default function BottomSheet({ visible, onClose, children, height = SCREEN_HEIGHT }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastOffset = useRef(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT - height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        let newY = gestureState.dy + lastOffset.current;
        if (newY < 0) newY = 0;
        translateY.setValue(SCREEN_HEIGHT - height + newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_DISMISS_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 180,
            useNativeDriver: true,
          }).start(() => onClose && onClose());
        } else {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT - height,
            duration: 180,
            useNativeDriver: true,
          }).start();
        }
        lastOffset.current = 0;
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.sheet,
          { height, transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    paddingHorizontal: 0,
    // alignItems removed for true full width
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
});
