import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
} from 'react-native';
import { Colors } from '../Constants/Colors';
import { height, width } from '../utils/UseDimensoins';
import { Video } from 'expo-av';

export const Frame = ({ item, index, goNext, goPrev }) => {
	if (item.type === 'image') {
		return (
			<ImageBackground
				imageStyle={{
					width: width,
					height: height,
					backgroundColor: Colors.primary.bleuBottom,
				}}
				source={{ uri: item.contentUrl }}
			>
				<SafeAreaView style={{ flexDirection: 'row' }}>
					{item.textContent &&
						item.textContent.map(({ text, bounds, y, x, style }) => (
							<Text
								style={
									style
										? {
												...styles.textContentItem,
												top: y + 48,
												left: x,
												...style,
										  }
										: {
												...styles.textContentItem,
												top: y + 48,
												left: x,
										  }
								}
							>
								{text}
							</Text>
						))}
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
				source={{ uri: item.contentUrl }}
				style={styles.backgroundVideo}
				resizeMode={'cover'}
				useNativeControls={false}
				shouldPlay={true}
			/>
			<SafeAreaView style={{ flexDirection: 'row' }}>
				{item.textContent &&
					item.textContent.map(({ text, bounds, x, y, style }) => (
						<Text
							style={
								style
									? {
											...styles.textContentItem,
											top: y + 48,
											left: x,
											...style,
									  }
									: {
											...styles.textContentItem,
											top: y + 48,
											left: x,
									  }
							}
						>
							{text}
						</Text>
					))}
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

	textContentItem: {
		position: 'absolute',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
