import {
	Image,
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
import { useUser } from '../Providers/UserProvider';
import tapTopIMG from '../assets/tapTop.png';
import { fetchCreator } from '../utils/fetch';

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

	useEffect(() => {
		getCreator(topic.creator);
	}, []);

	const [creator, setCreator] = useState('');

	const getCreator = async (creatorId) => {
		console.log('RUNNED', topic);
		const _creator = await fetchCreator(creatorId);
		console.log('AFTER', _creator);
		if (_creator) {
			setCreator(creator);
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
						backgroundColor: Colors.primary.lightBleu,
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
					<View>
						<Image style={{ marginBottom: -3 }} source={tapTopIMG} />
						<View style={styles.titleWrapper}>
							<Text style={{ fontSize: 11, color: 'white' }}>
								{topic.creator === user.id
									? user.name
									: creator
									? creator
									: 'TapUp'}
							</Text>
							<Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
								{topic.title}
							</Text>
						</View>
					</View>
				</ImageBackground>
			</Pressable>
		</Shadow>
	);
};

const styles = StyleSheet.create({
	titleWrapper: {
		backgroundColor: Colors.primary.pink,
		justifyContent: 'flex-end',
		padding: 5,
		paddingBottom: 8,
		paddingTop: 0,
	},
});
