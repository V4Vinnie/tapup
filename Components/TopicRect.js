import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, View } from 'react-native';
import { Colors } from '../Constants/Colors';

export const TopicRect = ({
	topic,
	removeSelected,
	addSelected,
	width,
	height,
}) => {
	const [isSelected, setIsSeleted] = useState(false);

	const clickedOnTopic = () => {
		if (isSelected) {
			setIsSeleted(false);
			removeSelected(topic);
		} else {
			setIsSeleted(true);
			addSelected(topic);
		}
	};

	const [image, setImage] = useState(null);

	useEffect(() => {
		if (topic.content) {
			setImage(topic.content);
		} else {
			setImage(topic.img);
		}
	}, []);

	return (
		<Pressable
			style={{ margin: 2.5, borderRadius: 5, overflow: 'hidden' }}
			onPress={() => clickedOnTopic()}
		>
			<ImageBackground
				style={{
					width: width,
					height: height,
					backgroundColor: Colors.primary.pink,
				}}
				imageStyle={
					isSelected
						? {
								opacity: 0.4,
						  }
						: { opacity: 1 }
				}
				source={{ uri: image }}
				resizeMode='cover'
			></ImageBackground>
		</Pressable>
	);
};
