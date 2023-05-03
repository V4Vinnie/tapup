import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import fontSizeImg from '../../assets/fontSize.png';

const colors = [
	'#000000',
	'#FFFFFF',
	'#FF0000',
	'#05FF00',
	'#0094FF',
	'#2E2AE5',
	'#AD00FF',
	'#FF00E5',
];

export const ColorPicker = ({ setColor, index, imageTexts }) => {
	return (
		<View style={styles.navHeading}>
			<Slider
				value={
					imageTexts[index].style && imageTexts[index].style.fontSize
						? Number(imageTexts[index].style.fontSize)
						: 20
				}
				minimumValue={12}
				step={1}
				maximumValue={36}
				onValueChange={(val) =>
					setColor(
						{ style: { ...imageTexts[index].style, fontSize: val } },
						index
					)
				}
				thumbImage={fontSizeImg}
			/>

			<View style={styles.colorWrapper}>
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
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	navHeading: {
		position: 'absolute',
		top: 55,
		zIndex: 500,
		width: '100%',
		paddingHorizontal: 15,
	},

	colorWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	colorButton: {
		width: 30,
		height: 20,
		borderRadius: 20,
		borderColor: Colors.primary.white,
		borderWidth: 2,
	},
});
