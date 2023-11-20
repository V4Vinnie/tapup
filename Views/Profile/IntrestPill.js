import { Pressable, StyleSheet } from 'react-native';
import { shadowProp } from '../../style';
import { Shadow } from 'react-native-shadow-2';
import { Colors } from '../../Constants/Colors';
import { MediumText } from '../../Components/Text/MediumText';

export const IntrestPill = ({ topic, onPillClick, isSelected }) => {
	return (
		<Shadow startColor='#00000015' distance={8} containerStyle={{ margin: 5 }}>
			<Pressable style={styles.pillConainer} onPress={() => onPillClick(topic)}>
				<MediumText
					style={{
						paddingHorizontal: 10,
						paddingVertical: 5,
						color: isSelected ? Colors.primary.white : Colors.primary.lightBleu,
						backgroundColor: isSelected
							? Colors.primary.pink
							: Colors.primary.white,
						width: 'auto',
						fontSize: 14,
					}}
				>
					{topic.title}
				</MediumText>
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
