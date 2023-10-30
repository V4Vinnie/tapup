import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { height, width } from '../../utils/UseDimensoins';
import { QuestionsSVG } from '../SVG/Icons/QuestionsSVG';

const AnimatedProgressView = ({ time, index, length, goNextOnComplete }) => {
	const [fillAnimation] = useState(new Animated.Value(0));

	useEffect(() => {
		Animated.timing(fillAnimation, {
			toValue: 1,
			duration: time,
			useNativeDriver: false,
		}).start(({ finished }) => {
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
							width: (width - 110) / length,
							backgroundColor: Colors.primary.black,
					  }
					: {
							width: (width - 110) / length,
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

export const FramePogress = ({
	length,
	activeFrame,
	time,
	goNext,
	setShowQuestion,
	showQuestion,
}) => {
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
										width: (width - 110) / length,
										backgroundColor: Colors.primary.pink,
								  }
								: {
										width: (width - 110) / length,
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
						showQuestion={showQuestion}
					/>
				);
			} else {
				_bars.push(
					<View
						style={
							index === length - 1
								? {
										width: (width - 110) / length,
										backgroundColor: Colors.primary.black,
								  }
								: {
										width: (width - 110) / length,
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
				zIndex: 5,
				marginLeft: 15,
				bottom: 40,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: width - 30,
			}}
		>
			<View
				style={{
					width: width - 110,
					height: 20,
					flexDirection: 'row',
					borderRadius: 50,
					overflow: 'hidden',
				}}
			>
				{bars.map((bar) => bar)}
			</View>

			<TouchableOpacity
				style={{
					backgroundColor: Colors.primary.white,
					height: 40,
					width: 40,
					borderRadius: 40,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				onPress={() => setShowQuestion(true)}
			>
				<QuestionsSVG isActive={true} style={{ transform: [{ scale: 0.8 }] }} />
			</TouchableOpacity>
		</View>
	);
};
