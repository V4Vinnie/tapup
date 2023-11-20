import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { width } from '../utils/UseDimensoins';
import { Colors } from '../Constants/Colors';

export const LoadingContent = ({
	indicationColor = Colors.primary.lightBleu,
}) => {
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animation = Animated.timing(animatedValue, {
			toValue: 1,
			duration: 2000, // Adjust the duration as needed
			useNativeDriver: false, // Make sure to set useNativeDriver to false for LinearGradient
		});

		Animated.loop(animation).start();
	}, [animatedValue]);

	const translateX = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-width, width],
	});

	return (
		<View style={styles.container}>
			<Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
				<LinearGradient
					// Button Linear Gradient
					colors={[
						`${indicationColor}01`,
						indicationColor,
						`${indicationColor}01`,
					]}
					style={styles.gradient}
					start={{ x: 0.2, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					locations={[0, 0.8, 1]}
				></LinearGradient>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
		height: 200,
	},
	gradient: {
		flex: 1,
	},
});
