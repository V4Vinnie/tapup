import { useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { Back } from '../../Components/Back';
import { BigTopicRect } from '../../Components/BigTopicRect';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { height, width } from '../../utils/UseDimensoins';
import BGPink from '../../assets/logo/pinkBG.png';
import BGDark from '../../assets/logo/darkBG.png';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';
import { fetchFrameById } from '../../utils/fetch';
import { BoldText } from '../../Components/Text/BoldText';

export const TabDetail = ({
	navigation,
	tab,
	setTopicDetail,
	setViewFrame,
}) => {
	const [moreTopics, setMoreTopics] = useState([]);

	const [creatorFrames, setCreatorFrames] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [isCreator, setIsCreator] = useState(tab.role);

	const TopicWidth = width / 3;

	useEffect(() => {
		const fetchCreatorFrames = async () => {
			setIsLoading(true);
			setIsCreator(true);
			let _creatorFrames = [];
			if (tab.frames) {
				for (let ind = 0; ind < tab.frames.length; ind++) {
					const _frame = tab.frames[ind];
					const _creatorFrame = await fetchFrameById(_frame);
					if (_creatorFrame) {
						_creatorFrames.push(_creatorFrame);
					}
				}
				setMoreTopics(_creatorFrames.slice(2, _creatorFrames.length));
				setCreatorFrames(_creatorFrames);
			} else {
				setCreatorFrames(_creatorFrames);
			}
			setIsLoading(false);
		};

		if (tab.role) {
			fetchCreatorFrames();
		} else {
			setMoreTopics(tab.topics.slice(2, tab.topics.length));
		}
	}, []);

	const setFrames = (frame) => {
		setViewFrame(frame);
		navigation.navigate('frames');
	};

	return (
		<>
			<SafeAreaView
				style={{ backgroundColor: Colors.primary.bleuBottom }}
			></SafeAreaView>

			<SafeAreaView
				style={{
					zIndex: 12,
					height: '100%',
					backgroundColor: Colors.primary.white,
				}}
			>
				<View style={styles.headerContainer}>
					<ImageBackground
						source={BGDark}
						resizeMode='cover'
						imageStyle={{
							height: 195,
							width: width,
							left: -10,
							top: -80,
						}}
					>
						<Back navigate={() => navigation.goBack()} />
						<MediumText
							style={{
								...sectionTitle,
								maxWidth: '75%',
								textAlign: 'left',
							}}
						>
							{isCreator ? `Frames by ${tab.name}` : tab.title}
						</MediumText>
					</ImageBackground>
				</View>
				<ScrollView style={{ paddingHorizontal: 10 }}>
					<View
						style={{
							zIndex: 0,
							justifyContent: 'center',
							marginTop: 40,
						}}
					>
						<ImageBackground
							resizeMode='cover'
							imageStyle={{
								height: 200,
								width: width,
								left: -10,
								top: -50,
							}}
							source={
								tab.profilePic
									? {
											uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/${tab.profilePic}?alt=media`,
									  }
									: tab.img.includes('/')
									? { uri: tab.img }
									: {
											uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/taps%2F${tab.id}%2F${tab.img}?alt=media`,
									  }
							}
						>
							<ImageBackground
								resizeMode='cover'
								imageStyle={{
									height: 200,
									width: width,
									left: -10,
									top: -50,
									opacity: 0.75,
								}}
								source={BGPink}
							>
								<RegularText style={{ color: Colors.primary.white }}>
									{!isCreator && tab.description}
								</RegularText>
							</ImageBackground>
						</ImageBackground>
					</View>

					{isCreator ? (
						<View style={styles.bigItemsConainer}>
							{!isLoading && creatorFrames.length > 1 ? (
								<>
									<BigTopicRect
										width={width / 2 - 50}
										height={300}
										topic={creatorFrames[0]}
										setFrames={setFrames}
										navigation={navigation}
									/>
									<BigTopicRect
										width={width / 2 - 10}
										height={300}
										topic={creatorFrames[1]}
										setFrames={setFrames}
										navigation={navigation}
									/>
								</>
							) : creatorFrames.length === 0 ? (
								<BoldText style={{ color: Colors.primary.white, fontSize: 20 }}>
									No frames for this user
								</BoldText>
							) : (
								<BigTopicRect
									width={width / 2 - 10}
									height={300}
									topic={creatorFrames[0]}
									setFrames={setFrames}
									navigation={navigation}
								/>
							)}
						</View>
					) : (
						<View style={styles.bigItemsConainer}>
							{tab.topics.length > 1 ? (
								<>
									<BigTopicRect
										width={width / 2 - 50}
										height={300}
										topic={tab.topics[0]}
										setTopicDetail={setTopicDetail}
										navigation={navigation}
									/>
									<BigTopicRect
										width={width / 2 - 10}
										height={300}
										topic={tab.topics[1]}
										setTopicDetail={setTopicDetail}
										navigation={navigation}
									/>
								</>
							) : (
								<BigTopicRect
									width={width / 2 - 10}
									height={300}
									topic={tab.topics[0]}
									setTopicDetail={setTopicDetail}
									navigation={navigation}
								/>
							)}
						</View>
					)}
					<MediumText style={styles.moreText}>
						{moreTopics.length === 0 ? '' : 'More'}
					</MediumText>
					<FlatList
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						numColumns={3}
						data={moreTopics}
						style={{ marginBottom: height / 3 }}
						renderItem={({ item }) => (
							<TopicRectApp
								width={TopicWidth - 10}
								height={200}
								topic={item}
								setTopicDetail={setTopicDetail}
								navigation={navigation}
							/>
						)}
						keyExtractor={(topic) => topic.id}
					/>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'column',
		width: '100%',
		alignItems: 'flex-start',
		zIndex: 10,
		paddingHorizontal: 10,
	},

	barContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	progrestext: {
		fontSize: 12,
		color: Colors.primary.white,
		marginLeft: 12,
	},

	bigItemsConainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		marginTop: 30,
	},

	moreText: {
		fontSize: 18,
		color: Colors.primary.bleuBottom,
	},
});
