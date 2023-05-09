import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { height, width } from '../utils/UseDimensoins';

const AnimatedProgressView = ({ time, index, length, goNextOnComplete }) => {
	const [fillAnimation] = useState(new Animated.Value(0));

	useEffect(() => {
		Animated.timing(fillAnimation, {
			toValue: 1,
			duration: time,
			useNativeDriver: false,
		}).start(({ finished }) => {
			console.log('H', index, finished);
			if (finished) {
				goNextOnComplete();
			}
		});

		return () => {
			fillAnimation.setValue(0);
			fillAnimation.stopAnimation();
		};
	}, []);

	return (
		<View
			style={
				index === length - 1
					? {
							width: (width - 30) / length,
							backgroundColor: Colors.primary.black,
					  }
					: {
							width: (width - 30) / length,
							backgroundColor: Colors.primary.black,
							borderRightWidth: 1,
							borderRightColor: Colors.primary.white,
					  }
			}
		>
			<Animated.View
				style={{
					height: '100%',
					backgroundColor: Colors.primary.pink,
					width: fillAnimation.interpolate({
						inputRange: [0, 1],
						outputRange: ['0%', '100%'],
					}),
				}}
			></Animated.View>
		</View>
	);
};

export const FramePogress = ({ length, activeFrame, time, goNext }) => {
	const [bars, setBars] = useState([]);

	useEffect(() => {
		let _bars = [];
		for (let index = 0; index < length; index++) {
			if (index < activeFrame) {
				_bars.push(
					<View
						style={
							index === length - 1
								? {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.pink,
								  }
								: {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.pink,
										borderRightWidth: 1,
										borderRightColor: Colors.primary.white,
								  }
						}
					></View>
				);
			} else if (index === activeFrame) {
				_bars.push(
					<AnimatedProgressView
						time={time}
						index={index}
						length={length}
						goNextOnComplete={goNext}
					/>
				);
			} else {
				_bars.push(
					<View
						style={
							index === length - 1
								? {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.black,
								  }
								: {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.black,
										borderRightWidth: 1,
										borderRightColor: Colors.primary.white,
								  }
						}
					></View>
				);
			}
		}
		setBars(_bars);
	}, [activeFrame]);

	return (
		<View
			style={{
				position: 'absolute',
				zIndex: 10,
				width: width - 30,
				height: 10,
				marginLeft: 15,
				top: height - 70,
				flexDirection: 'row',
				borderRadius: 50,
				overflow: 'hidden',
			}}
		>
			{bars.map((bar) => bar)}
		</View>
	);
};
