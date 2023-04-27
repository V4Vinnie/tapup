import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { useEffect, useState } from 'react';
import { useUser } from '../Providers/UserProvider';

export const TopicRectApp = ({
	navigation,
	topic,
	width,
	height,
	setTopicDetail,
	setFrames,
	setTabDetail,
	setEditorFrame,
}) => {
	const { user } = useUser();
	const clickedOnTopic = () => {
		if (setTabDetail) {
			setTabDetail(topic);
			navigation.navigate('tabDetail');
		} else if (setTopicDetail) {
			setTopicDetail(topic);
			navigation.navigate('detail');
		} else if (setFrames) {
			setFrames(topic);
		} else if (setEditorFrame) {
			setEditorFrame(topic);
			navigation.navigate('editFrame');
		}
	};

	return (
		<Shadow
			distance={5}
			offset={[1, 1]}
			style={{ width: width, borderRadius: 5 }}
			containerStyle={{ margin: 5, borderRadius: 5 }}
		>
			<Pressable
				style={{ borderRadius: 5, overflow: 'hidden' }}
				onPress={() => clickedOnTopic()}
			>
				<ImageBackground
					style={{
						width: width,
						height: height,
						backgroundColor: Colors.primary.pink,
						justifyContent: 'flex-end',
					}}
					source={
						topic.img.includes('/')
							? { uri: topic.img }
							: {
									uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${topic.id}%2F${topic.img}?alt=media`,
							  }
					}
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
						<Text style={{ fontSize: 11 }}>
							{topic.creator === user.id ? user.name : 'creator'}
						</Text>
					</LinearGradient>
				</ImageBackground>
			</Pressable>
		</Shadow>
	);
};
