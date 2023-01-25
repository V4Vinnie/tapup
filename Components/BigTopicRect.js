import {
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Colors } from '../Constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { useEffect, useState } from 'react';

export const BigTopicRect = ({
	navigation,
	topic,
	height,
	setTopicDetail,
	setFrames,
	setTabDetail,
}) => {
	const clickedOnTopic = () => {
		if (setTabDetail) {
			setTabDetail(topic);
			navigation.navigate('tabDetail');
		} else if (setTopicDetail) {
			setTopicDetail(topic);
			navigation.navigate('detail');
		} else if (setFrames) {
			setFrames(topic);
		}
	};
	const [image, setImage] = useState(null);

	useEffect(() => {
		if (topic.content) {
			setImage(topic.content);
			console.log(image);
		} else {
			setImage(topic.img);
		}
	}, []);

	return (
		<Shadow
			style={{ width: '100%' }}
			containerStyle={{ width: '48%', marginBottom: 20 }}
		>
			<Pressable style={styles.pressable} onPress={() => clickedOnTopic()}>
				<ImageBackground
					style={{
						width: '100%',
						height: height,
						backgroundColor: Colors.primary.pink,
						justifyContent: 'flex-end',
					}}
					source={{ uri: image }}
					resizeMode='cover'
				>
					<LinearGradient
						locations={[0.1, 0.5]}
						colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
						style={{ height: '40%', justifyContent: 'flex-end', padding: 5 }}
					>
						<Text style={{ fontSize: 13, fontWeight: '600' }}>
							{topic.title}
						</Text>
						<Text style={{ fontSize: 11 }}>{topic.creator}</Text>
					</LinearGradient>
				</ImageBackground>
				<Text numberOfLines={3} style={styles.descriptionText}>
					{topic.description}
				</Text>
			</Pressable>
		</Shadow>
	);
};

const styles = StyleSheet.create({
	pressable: {
		borderRadius: 5,
		overflow: 'hidden',
		padding: 5,
		backgroundColor: Colors.primary.white,
		width: '100%',
	},

	descriptionText: {
		fontSize: 12,
		opacity: 0.3,
		color: Colors.primary.black,
		height: 45,
	},
});
