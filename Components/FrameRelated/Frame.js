import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
} from 'react-native';
import { height, width } from '../../utils/UseDimensoins';
import { Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

export const Frame = ({ item, index, goNext, goPrev }) => {
	const videoRef = useRef();

	const [startVideo, setStartVideo] = useState(false);

	const [startTime, setStartTime] = useState(0);

	useEffect(() => {
		setStartTime(0);
	}, [item]);

	if (item.type === 'image') {
		return (
			<ImageBackground
				imageStyle={{
					width: width,
					aspectRatio: 9 / 16,
					objectFit: 'contain',
				}}
				source={{ uri: item.contentUrl }}
			>
				<SafeAreaView style={{ flexDirection: 'row' }}>
					<Pressable
						onPress={() => goPrev()}
						style={{ width: '50%', height: height }}
					></Pressable>

					<Pressable
						onPress={() => goNext()}
						style={{ width: '50%', height: height }}
					></Pressable>
				</SafeAreaView>
			</ImageBackground>
		);
	}

	return (
		<>
			<Video
				ref={videoRef}
				source={{ uri: item.contentUrl }}
				style={styles.backgroundVideo}
				resizeMode={'contain'}
				useNativeControls={false}
				shouldPlay={startVideo}
				onReadyForDisplay={() => {
					setStartTime(0);
					setStartVideo(true);
				}}
				onPlaybackStatusUpdate={(status) => {
					setStartTime(status.positionMillis);
				}}
				positionMillis={startTime === 0 ? 0 : undefined}
			/>
			<SafeAreaView style={{ flexDirection: 'row' }}>
				<Pressable
					onPress={() => {
						goPrev();
						setStartTime(0);
					}}
					style={{ width: '50%', height: height }}
				></Pressable>

				<Pressable
					onPress={() => {
						goNext();
						setStartTime(0);
					}}
					style={{ width: '50%', height: height }}
				></Pressable>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	backgroundVideo: {
		height: height,
		position: 'absolute',
		top: 0,
		left: 0,
		alignItems: 'stretch',
		bottom: 0,
		right: 0,
	},

	textWrapper: {
		position: 'absolute',
		pointerEvents: 'none',
		maxWidth: width - 120,
		height: '100%',
	},

	textContentItem: {
		fontWeight: 'bold',
	},
});
