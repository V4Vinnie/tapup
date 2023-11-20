import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { useState } from 'react';
import Arrow from '../../assets/arrow.png';

import TextColor from '../../assets/icons/textColor.png';
import BGColor from '../../assets/icons/backgroundColor.png';
import TextStyle from '../../assets/icons/textStyle.png';

const MENU = {
	COLOR: 'color',
	BACKGROUND: 'background',
	STYLE: 'style',
};

const colors = [
	'#000000',
	'#FFFFFF',
	'#FF0000',
	'#05FF00',
	'#19DAFF',
	'#1D233A',
	'#FF197C',
	'#FFE600',
];

const backgroundColors = [
	'transparent',
	'#000000',
	'#FFFFFF',
	'#FF0000',
	'#05FF00',
	'#19DAFF',
	'#1D233A',
	'#FF197C',
	'#FFE600',
];

const fontStyles = [
	'normal',
	'AvenirNext-Heavy',
	'Avenir-HeavyOblique',
	'American Typewriter',
	'Times New Roman',
	'Copperplate',
];

export const TextStyleSwitcher = ({ imageTexts, index, setColor }) => {
	const [styleMenu, setStyleMenu] = useState();

	switch (styleMenu) {
		case MENU.COLOR:
			return (
				<>
					<Pressable onPress={() => setStyleMenu('')}>
						<Image source={Arrow} />
					</Pressable>
					{colors.map((colorVal) => (
						<Pressable
							style={
								imageTexts[index].style &&
								imageTexts[index].style.color === colorVal
									? {
											...styles.colorButton,
											borderColor: Colors.primary.pink,
											backgroundColor: colorVal,
											borderWidth: 4,
											transform: [{ scale: 0.85 }],
									  }
									: { ...styles.colorButton, backgroundColor: colorVal }
							}
							onPress={() =>
								setColor(
									{ style: { ...imageTexts[index].style, color: colorVal } },
									index
								)
							}
						></Pressable>
					))}
				</>
			);

		case MENU.BACKGROUND:
			return (
				<>
					<Pressable onPress={() => setStyleMenu('')}>
						<Image source={Arrow} />
					</Pressable>
					{backgroundColors.map((colorVal) => (
						<Pressable
							style={
								imageTexts[index].style &&
								imageTexts[index].style.backgroundColor === colorVal
									? {
											...styles.colorButton,
											borderColor: Colors.primary.pink,
											backgroundColor: colorVal,
											borderWidth: 4,
											transform: [{ scale: 0.85 }],
									  }
									: { ...styles.colorButton, backgroundColor: colorVal }
							}
							onPress={() =>
								setColor(
									{
										style: {
											...imageTexts[index].style,
											backgroundColor: colorVal,
										},
									},
									index
								)
							}
						></Pressable>
					))}
				</>
			);

		case MENU.STYLE:
			return (
				<>
					<Pressable onPress={() => setStyleMenu('')}>
						<Image source={Arrow} />
					</Pressable>
					{fontStyles.map((fontVal) => (
						<Pressable
							style={
								imageTexts[index].style &&
								imageTexts[index].style.backgroundColor === fontVal
									? {
											...styles.styleButton,
											transform: [{ scale: 0.85 }],
									  }
									: { ...styles.styleButton, fontFamily: fontVal }
							}
							onPress={() =>
								setColor(
									{
										style: {
											...imageTexts[index].style,
											fontFamily: fontVal,
										},
									},
									index
								)
							}
						>
							<Text style={{ fontSize: 12, fontFamily: fontVal }}>Abc</Text>
						</Pressable>
					))}
				</>
			);

		default:
			return (
				<View style={styles.styleEditButtonWrapper}>
					<Pressable onPress={() => setStyleMenu(MENU.COLOR)}>
						<Image source={TextColor} />
					</Pressable>
					<Pressable onPress={() => setStyleMenu(MENU.BACKGROUND)}>
						<Image source={BGColor} />
					</Pressable>
					<Pressable onPress={() => setStyleMenu(MENU.STYLE)}>
						<Image source={TextStyle} />
					</Pressable>
				</View>
			);
	}
};

const styles = StyleSheet.create({
	colorButton: {
		width: 30,
		height: 20,
		borderRadius: 20,
		borderColor: Colors.primary.white,
		borderWidth: 2,
	},

	styleButton: {
		backgroundColor: Colors.primary.white,
		padding: 5,
		borderRadius: 4,
		fontWeight: 'bold',
	},

	styleEditButtonWrapper: {
		flexDirection: 'row',
		width: 160,
		justifyContent: 'space-between',
	},
});
