import { StyleSheet, Text, View } from 'react-native';
import { shadowProp } from '../style';
import { Shadow } from 'react-native-shadow-2';

export const Pill = ({ label, color, textColor }) => (
	<Shadow containerStyle={{ margin: 5 }} >
		<View style={styles.pillConainer}>
			<Text
				style={{
					paddingHorizontal: 10,
					paddingVertical: 5,
					color: textColor,
					backgroundColor: color,
					width: 'auto',
					fontSize: 12,
				}}
			>
				{label}
			</Text>
		</View>
	</Shadow>
);

const styles = StyleSheet.create({
	pillConainer: {
		...shadowProp,
		alignSelf: 'flex-start',
		borderRadius: 25,
		overflow: 'hidden',
	},
});
