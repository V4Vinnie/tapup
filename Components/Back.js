import { Pressable, Text, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { ArrowSmall } from './SVG/ArrowSmall';
import { StyleSheet } from 'react-native';
import { RegularText } from './Text/RegularText';

export const Back = ({ navigate }) => (
	<Pressable style={styles.backPress} onPress={navigate}>
		<View style={styles.arrowView}>
			<ArrowSmall />
		</View>
		<RegularText style={styles.backText}>Back</RegularText>
	</Pressable>
);

const styles = StyleSheet.create({
	backPress: { flexDirection: 'row', alignItems: 'center', opacity: 0.8 },
	arrowView: {
		transform: [{ rotate: '180deg' }],
		marginRight: 10,
	},
	backText: { color: Colors.primary.white, fontSize: 20 },
});
