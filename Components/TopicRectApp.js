import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { Shadow } from 'react-native-shadow-2';
import { useEffect, useState } from 'react';
import { useUser } from '../Providers/UserProvider';
import { fetchCreator } from '../utils/fetch';
import { RegularText } from './Text/RegularText';
import { MediumText } from './Text/MediumText';
import { TapTopSVG } from './SVG/TapTopSVG';

export const TopicRectApp = ({
	navigation,
	topic,
	width,
	height,
	setTopicDetail,
	setFrames,
	setTabDetail,
	setEditorFrame,
	cacheContent,
}) => {
	const { user } = useUser();
	const clickedOnTopic = async () => {
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

	const [creator, setCreator] = useState(undefined);
	const [isLoadingName, setIsLoadingName] = useState(true);

	const getCreator = async (creatorId) => {
		setIsLoadingName(true);
		const _creator = await fetchCreator(creatorId);

		if (_creator) {
			setCreator(_creator);
		} else {
			setCreator(undefined);
		}
		setIsLoadingName(false);
	};

	return (
		<Shadow
			distance={5}
			offset={[1, 1]}
			style={{
				width: width,
				borderRadius: 5,
			}}
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
									uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/${
										setTabDetail
											? 'taps'
											: setTopicDetail
											? 'topics'
											: setFrames || setEditorFrame
											? 'frames'
											: 'frames'
									}%2F${topic.id}%2F${topic.img}?alt=media`,
							  }
					}
					resizeMode='cover'
				>
					<View>
						<TapTopSVG
							style={{
								marginBottom: -1,
								height: 10,
								width: '100%',
								right: '40%',
								objectFit: 'contain',
							}}
						/>
						{/* <Image
							style={{
								marginBottom: -1,
								height: 10,
								width: '100%',
								right: '40%',
								objectFit: 'contain',
							}}
							source={tapTopIMG}
						/> */}
						<View style={styles.titleWrapper}>
							<RegularText style={{ fontSize: 11, color: 'white' }}>
								{!isLoadingName
									? creator
									: topic.creator === user.id
									? user.names
									: 'TapUp'}
							</RegularText>
							<MediumText style={{ fontSize: 12, color: 'white' }}>
								{topic.title}
							</MediumText>
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
