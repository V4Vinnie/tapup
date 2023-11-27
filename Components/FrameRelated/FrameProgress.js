import React, { useEffect, useState, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { width } from '../../utils/UseDimensoins';
import { QuestionsSVG } from '../SVG/Icons/QuestionsSVG';
import { HeartSVG } from '../SVG/Icons/HeartSVG';
import { PlaySVG } from '../SVG/Icons/PlaySVG';
import { PauseSVG } from '../SVG/Icons/PauseSVG';

const AnimatedProgressView = ({
	time,
	index,
	length,
	goNextOnComplete,
	paused,
}) => {
	const fillAnimation = useRef(new Animated.Value(0)).current;

	const [animationStatus, setAnimationStatus] = useState(time);

	useEffect(() => {
		let animation;

		if (!paused) {
			animation = Animated.timing(fillAnimation, {
				toValue: 1,
				duration: animationStatus,
				useNativeDriver: false,
			});

			animation.start(({ finished }) => {
				if (finished) {
					goNextOnComplete();
				}
			});
		} else {
			if (animation) {
				fillAnimation.stopAnimation((value) => {
					const percentageValue = time * value;
					setAnimationStatus(time - percentageValue);
				});
			}
		}

		return () => {
			if (animation) {
				fillAnimation.stopAnimation((value) => {
					const percentageValue = time * value;
					setAnimationStatus(time - percentageValue);
				});
			}
		};
	}, [fillAnimation, time, goNextOnComplete, paused]);

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
			/>
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
	toggleLike,
	isLiked,
	setPauseVideo,
	pausedVideo,
}) => {
	const [bars, setBars] = useState([]);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		let _bars = [];
		for (let index = 0; index < length; index++) {
			if (index < activeFrame) {
				_bars.push(
					<View
						key={index}
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
					/>
				);
			} else if (index === activeFrame) {
				_bars.push(
					<AnimatedProgressView
						key={index}
						time={time}
						index={index}
						length={length}
						goNextOnComplete={goNext}
						paused={pausedVideo}
					/>
				);
			} else {
				_bars.push(
					<View
						key={index}
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
					/>
				);
			}
		}
		setBars(_bars);
	}, [activeFrame, length, time, pausedVideo]);

	const handleTogglePause = () => {
		setPaused((prevPaused) => !prevPaused);
		setPauseVideo((prevPaused) => !prevPaused);
	};

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
			<TouchableOpacity
				style={{
					width: 20,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				onPress={handleTogglePause}
			>
				{pausedVideo ? <PlaySVG /> : <PauseSVG />}
			</TouchableOpacity>

			<View
				style={{
					width: width - 160,
					height: 15,
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
				onPress={() => toggleLike()}
			>
				<HeartSVG isActive={isLiked} />
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: Colors.primary.white,
					height: 40,
					width: 40,
					borderRadius: 40,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				onPress={() => {
					if (!pausedVideo) {
						handleTogglePause();
					}
					setShowQuestion(true);
				}}
			>
				<QuestionsSVG isActive={true} style={{ transform: [{ scale: 0.8 }] }} />
			</TouchableOpacity>
		</View>
	);
};
