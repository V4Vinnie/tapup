import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { Pencil } from './SVG/Pencil';

export const ProfielPic = ({ size, img, isEditable }) => {
	const pencilTop = size / 2 - 50;

	const pencilLeft = size / 2 - 50;

	return (
		<View style={{ width: size, height: size, ...styles.profilePicWrapper }}>
			{isEditable ? (
				<View
					style={{ top: pencilTop, left: pencilLeft, ...styles.pencilWrapper }}
				>
					<Pencil />
				</View>
			) : null}
			<Image
				style={styles.ProfielPicImg}
				source={{
					uri: `${
						img
							? img
							: 'https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/UI%2FprofilePic.png?alt=media'
					}`,
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	profilePicWrapper: {
		borderRadius: 5000,
		overflow: 'hidden',
		zIndex: 100,
		backgroundColor: Colors.primary.white,
	},

	ProfielPicImg: {
		width: '100%',
		height: '100%',
	},

	pencilWrapper: {
		position: 'absolute',
		zIndex: 500,
		width: '100%',
		height: '100%',
	},
});
