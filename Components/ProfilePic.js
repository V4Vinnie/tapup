import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { Pencil } from './SVG/Pencil';

export const ProfielPic = ({
	size,
	img,
	isEditable,
	clickPencil,
	pencilPlace,
	pencilSize,
}) => {
	return (
		<View style={{ width: size, height: size, ...styles.profilePicWrapper }}>
			{isEditable ? (
				<TouchableOpacity
					style={
						pencilPlace
							? {
									top: pencilPlace.top,
									left: size - pencilPlace.left,
									...styles.pencilWrapper,
							  }
							: { top: -40, left: size - 45, ...styles.pencilWrapper }
					}
					onPress={() => clickPencil()}
				>
					<Pencil width={pencilSize ? pencilSize : 40} />
				</TouchableOpacity>
			) : null}
			<Image
				style={styles.ProfielPicImg}
				source={
					img.isLocal
						? {
								uri: img.url,
						  }
						: {
								uri: `${`https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/${img}?alt=media`}`,
						  }
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	profilePicWrapper: {
		borderRadius: 5000,

		zIndex: 100,
		backgroundColor: Colors.primary.white,
	},

	ProfielPicImg: {
		width: '100%',
		height: '100%',
		borderRadius: 5000,
		backgroundColor: Colors.primary.lightBleu,
	},

	pencilWrapper: {
		position: 'absolute',
		zIndex: 500,
		width: '100%',
		height: '100%',
	},
});
