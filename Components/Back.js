import { Pressable, Text, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { ArrowSmall } from './SVG/ArrowSmall';

export const Back = ({ navigate }) => (
	<Pressable
		style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.8 }}
		onPress={navigate}
	>
		<View
			style={{
				transform: [{ rotate: '180deg' }],
				marginRight: 10,
			}}
		>
			<ArrowSmall />
		</View>
		<Text style={{ color: Colors.primary.white, fontSize: 20 }}>Back</Text>
	</Pressable>
);
