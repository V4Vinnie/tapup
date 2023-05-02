import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../Constants/Colors';

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
			{colors.map((colorVal) => (
				<Pressable
					style={
						imageTexts[index].style &&
						imageTexts[index].style.color === colorVal
							? {
									...styles.colorButton,
									borderColor: Colors.primary.pink,
									backgroundColor: colorVal,
									transform: [{ scale: 0.85 }],
							  }
							: { ...styles.colorButton, backgroundColor: colorVal }
					}
					onPress={() => setColor({ style: { color: colorVal } }, index)}
				></Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	navHeading: {
		position: 'absolute',
		top: 55,
		zIndex: 500,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 15,
	},

	colorButton: {
		width: 30,
		height: 20,
		borderRadius: 20,
		borderColor: Colors.primary.white,
		borderWidth: 2,
	},
});
