import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Colors } from '../Constants/Colors';
import { height, width } from '../utils/UseDimensoins';
import { Back } from './Back';
import { Video, AVPlaybackStatus } from 'expo-av';

export const Frame = ({ item, index, goNext, goPrev }) => {
	if (item.type === 'image') {
		return (
			<ImageBackground
				imageStyle={{
					width: width,
					height: height,
					backgroundColor: Colors.primary.bleuBottom,
				}}
				source={{ uri: item.content }}
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
				source={{ uri: item.content }}
				style={styles.backgroundVideo}
				resizeMode={'cover'}
				useNativeControls={false}
				shouldPlay={true}
			/>
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
		backgroundColor: Colors.primary.bleuBottom,
	},
});
