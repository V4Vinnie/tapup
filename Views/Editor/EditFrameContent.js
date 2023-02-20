import { Image, ImageBackground, Text, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { height, width } from '../../utils/UseDimensoins';

export const EditorFrameContent = ({ item }) => {
	console.log('cont', item);
	if (item.type === 'video') {
	}
	return (
		<ImageBackground
			imageStyle={{
				backgroundColor: Colors.primary.pink,
			}}
			style={{
				width: width / 3 - 20,
				height: height / 4 - 20,
				marginHorizontal: 5,
			}}
			source={{ uri: item.content }}
		></ImageBackground>
	);
};
