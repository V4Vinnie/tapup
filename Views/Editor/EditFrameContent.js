import { useEffect, useState } from 'react';
import { Animated, ImageBackground, Pressable } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { height, width } from '../../utils/UseDimensoins';

export const EditFrameContent = ({
	item,
	editThisFrame,
	setImageText,
	frameID,
}) => {
	const [isPressed, setIsPressed] = useState(false);
	const [colorAnimation] = useState(new Animated.Value(0));

	useEffect(() => {
		Animated.loop(
			Animated.timing(colorAnimation, {
				toValue: 1,
				duration: 2000,
				useNativeDriver: false,
			})
		).start();
	}, [colorAnimation]);

	const backgroundColor = colorAnimation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [
			Colors.primary.lightBleu,
			'rgba(25, 218, 255, 0.6);',
			Colors.primary.lightBleu,
		],
	});

	return (
		<>
			<Pressable
				onLongPress={() => console.log('DELETE')}
				onPress={() => {
					editThisFrame(item);
				}}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
			>
				<Animated.View
					style={{
						backgroundColor,
						flex: 1,
						width: width / 3 - 20,
						height: height / 4 - 20,
						position: 'absolute',
						margin: 5,
					}}
				/>
				<ImageBackground
					style={
						isPressed
							? {
									width: width / 3 - 20,
									height: height / 4 - 20,
									margin: 5,
									opacity: 0.5,
							  }
							: {
									width: width / 3 - 20,
									height: height / 4 - 20,
									margin: 5,
							  }
					}
					source={{ uri: item.thumbnailUrl }}
				></ImageBackground>
			</Pressable>
		</>
	);
};
