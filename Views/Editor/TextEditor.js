import { StyleSheet, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import Slider from '@react-native-community/slider';
import fontSizeImg from '../../assets/fontSize.png';
import { TextStyleSwitcher } from './TextStyleSwitcher';

export const TextEditor = ({ setColor, index, imageTexts }) => {
	return (
		<View style={styles.navHeading}>
			<Slider
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
				value={imageTexts[index].style.fontSize}
			/>

			<View style={styles.colorWrapper}>
				<TextStyleSwitcher
					imageTexts={imageTexts}
					index={index}
					setColor={setColor}
				/>
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
