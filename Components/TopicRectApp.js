import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export const TopicRectApp = ({
	navigation,
	topic,
	width,
	height,
	setTopicDetail,
	setFrames,
}) => {
	const clickedOnTopic = () => {
		if (setTopicDetail) {
			setTopicDetail(topic);
			navigation.navigate('detail');
		} else if (setFrames) {
			setFrames(topic);
		}
	};

	const image = { uri: topic.img };

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
					justifyContent: 'flex-end',
				}}
				source={image}
				resizeMode='cover'
			>
				<LinearGradient
					locations={[0.1, 0.5]}
					colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
					style={{ height: '40%', justifyContent: 'flex-end', padding: 5 }}
				>
					<Text style={{ fontSize: 13, fontWeight: '600' }}>{topic.title}</Text>
					<Text style={{ fontSize: 11 }}>Creator</Text>
				</LinearGradient>
			</ImageBackground>
		</Pressable>
	);
};
