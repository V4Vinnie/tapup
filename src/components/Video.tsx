import { useVideoPlayer, VideoView } from 'expo-video';
import { useRef } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

type Props = {
	video: string;
};

const Video = ({ video }: Props) => {
	const ref = useRef(null);
	const player = useVideoPlayer(video, (player) => {
		player.loop = true;
		player.play();
	});

	return (
		<View style={styles.contentContainer}>
			<Text>Replace</Text>
			<VideoView
				ref={ref}
				style={styles.video}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
			/>
			<View style={styles.controlsContainer}>
				<Button
					title={player.playing ? 'Pause' : 'Play'}
					onPress={() => {
						if (player.playing) {
							player.pause();
						} else {
							player.play();
						}
					}}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 50,
	},
	video: {
		width: 350,
		height: 275,
	},
	controlsContainer: {
		padding: 10,
	},
});

export default Video;
