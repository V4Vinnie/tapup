import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Logo } from './SVG/Logo';

export const LoadingRefresh = () => {
	const scaleAnim = useRef(new Animated.Value(0.1)).current;

	const fadeIn = () => {
		// Will change fadeAnim value to 1 in 5 seconds
		Animated.loop(
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 0.13,
					duration: 500,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 0.1,
					duration: 500,
					useNativeDriver: true,
				}),
			])
		).start();
	};

	useEffect(() => {
		fadeIn();
	}, []);

	return (
		<Animated.View
			style={[
				styles.scaleContainer,
				{
					// Bind opacity to animated value
					transform: [{ scale: scaleAnim }],
				},
			]}
		>
			<Logo />
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	scaleContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
