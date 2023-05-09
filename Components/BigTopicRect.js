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
import tapTopIMG from '../assets/tapTop_white.png';
import { fetchCreator } from '../utils/fetch';

export const BigTopicRect = ({
	navigation,
	topic,
	height,
	setTopicDetail,
	setFrames,
	setTabDetail,
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
		}
	};
	const [image, setImage] = useState(null);
	const [creator, setCreator] = useState('');

	useEffect(() => {
		if (topic.content) {
			setImage(topic.content);
		} else {
			if (topic.img.includes('/')) {
				setImage(topic.img);
			} else {
				setImage(
					`https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${topic.id}%2F${topic.img}?alt=media`
				);
			}
		}
		getCreator(topic.creator);
	}, []);

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
						borderRadius: 2,
						overflow: 'hidden',
					}}
					source={{ uri: image }}
					resizeMode='cover'
				>
					<View>
						<Image
							style={{ marginBottom: -3, marginLeft: -3 }}
							source={tapTopIMG}
						/>
						<View style={styles.titleWrapper}>
							<Text style={{ fontSize: 11 }}>
								{topic.creator === user.id
									? user.name
									: creator
									? creator
									: 'TapUp'}
							</Text>
							<Text style={{ fontSize: 13, fontWeight: '600' }}>
								{topic.title}
							</Text>
						</View>
					</View>
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
		marginTop: 5,
	},

	titleWrapper: {
		backgroundColor: Colors.primary.white,
		justifyContent: 'flex-end',
		paddingTop: 0,
	},
});
