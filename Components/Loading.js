import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../Constants/Colors';

import { height, width } from '../utils/UseDimensoins';
import { Logo } from './SVG/Logo';

export const Loading = () => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const fadeIn = () => {
		// Will change fadeAnim value to 1 in 5 seconds
		Animated.loop(
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 1.2,
					duration: 2000,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 2000,
					useNativeDriver: true,
				}),
			])
		).start();
	};

	useEffect(() => {
		fadeIn();
	}, []);

	return (
		<SafeAreaView style={styles.loadingContainer}>
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
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		width: width,
		height: height,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary.bleuBottom,
	},
	scaleContainer: {},
});
