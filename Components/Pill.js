import { Pressable, StyleSheet } from 'react-native';
import { shadowProp } from '../style';
import { Shadow } from 'react-native-shadow-2';
import { RegularText } from './Text/RegularText';

export const Pill = ({
	tap,
	color,
	textColor,
	setTabDetail,
	navigation,
	isCreator,
}) => {
	const onPillClick = () => {
		setTabDetail(tap);
		navigation.navigate('tabDetail');
	};
	return (
		<Shadow containerStyle={{ margin: 5 }}>
			<Pressable style={styles.pillConainer} onPress={() => onPillClick()}>
				<RegularText
					style={{
						paddingHorizontal: 10,
						paddingVertical: 5,
						color: textColor,
						backgroundColor: color,
						width: 'auto',
						fontSize: 12,
					}}
				>
					{isCreator ? tap.name : tap.title}
				</RegularText>
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
