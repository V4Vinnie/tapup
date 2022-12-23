import { Image, StyleSheet, View } from 'react-native';

export const ProfielPic = ({ size, img }) => {
	return (
		<View style={{ width: size, height: size, ...styles.profilePicWrapper }}>
			<Image
				style={styles.ProfielPicImg}
				source={{
					uri: `${
						img
							? img
							: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
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
	},

	ProfielPicImg: {
		width: '100%',
		height: '100%',
	},
});
