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
import { Video } from 'expo-av';
import Draggable from 'react-native-draggable';
import { useState } from 'react';

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
							<View style={{ ...styles.textWrapper, top: y + 48, left: x }}>
								<Text
									style={
										style
											? {
													...styles.textContentItem,
													...style,
											  }
											: {
													...styles.textContentItem,
											  }
									}
								>
									{text}
								</Text>
							</View>
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
						<View style={{ ...styles.textWrapper, top: y + 48, left: x }}>
							<Text
								style={
									style
										? {
												...styles.textContentItem,
												...style,
										  }
										: {
												...styles.textContentItem,
										  }
								}
							>
								{text}
							</Text>
						</View>
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
