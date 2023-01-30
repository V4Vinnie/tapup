import { Pressable, StyleSheet, Text, View } from 'react-native';
import { shadowProp } from '../style';
import { Shadow } from 'react-native-shadow-2';

export const Pill = ({ tap, color, textColor, setTabDetail, navigation }) => {
	const onPillClick = () => {
		setTabDetail(tap);
		navigation.navigate('tabDetail');
	};
	return (
		<Shadow containerStyle={{ margin: 5 }}>
			<Pressable style={styles.pillConainer} onPress={() => onPillClick()}>
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
					{tap.title}
				</Text>
			</Pressable>
		</Shadow>
	);
};

const styles = StyleSheet.create({
	pillConainer: {
		...shadowProp,
		alignSelf: 'flex-start',
		borderRadius: 25,
		overflow: 'hidden',
	},
});
