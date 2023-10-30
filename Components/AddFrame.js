import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { Shadow } from 'react-native-shadow-2';
import { Entypo } from '@expo/vector-icons';

export const AddFrame = ({ navigation, clickNav }) => {
	return (
		<View style={styles.inwrap}>
			<Shadow style={styles.container}>
				<Pressable onPress={() => clickNav()} style={{ padding: 15 }}>
					<Entypo name='plus' size={44} color='#FFFFFF' />
				</Pressable>
			</Shadow>
		</View>
	);
};

const styles = StyleSheet.create({
	inwrap: {
		borderRadius: 50,
		alignItems: 'flex-end',
		marginRight: 10,
		position: 'absolute',
		zIndex: 999,
		right: 80,
		bottom: 180,
	},
	container: {
		position: 'absolute',
		backgroundColor: Colors.primary.pink,
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 50,
	},
});
