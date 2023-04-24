import { useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Bar } from 'react-native-progress';
import { Back } from '../../Components/Back';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { width } from '../../utils/UseDimensoins';
import BGPink from '../../assets/logo/pinkBG.png';
import BGDark from '../../assets/logo/darkBG.png';
import { BigTopicRect } from '../../Components/BigTopicRect';
import { Loading } from '../../Components/Loading';
import { findTabByTopicId } from '../../utils/findTabByTopicId';
import { fetchFrames, getWatchedFramesByTopicId } from '../../utils/fetch';
import { useTaps } from '../../Providers/TapsProvider';
import { useUser } from '../../Providers/UserProvider';
import { useIsFocused } from '@react-navigation/native';

export const TopicDetail = ({
	navigation,
	topic,
	setTabDetail,
	setViewFrame,
}) => {
	const [doneFrames, setDoneFrames] = useState(0);
	const [allFrames, setAllFrames] = useState(null);

	const { taps } = useTaps();

	const { user } = useUser();

	const isFocused = useIsFocused();

	useEffect(() => {
		const getTabs = async () => {
			setAllFrames(null);
			const tap = findTabByTopicId(taps, topic.id);
			const _frames = await fetchFrames(tap.id, topic.id);
			const _watchedFrames = await getWatchedFramesByTopicId(topic.id, user.id);

			let done = 0;

			if (_watchedFrames) {
				_watchedFrames.map((frame) => {
					if (frame.isDone) {
						if (done !== _frames.length) {
							done++;
						}
					}
				});
			}

			setDoneFrames(done);
			setAllFrames(_frames);
		};

		getTabs();
	}, [isFocused]);

	const TopicWidth = width / 3;

	const setFrames = (frame) => {
		setViewFrame(frame);
		navigation.navigate('frames');
	};

	if (allFrames) {
		return (
			<>
				<ScrollView
					nestedScrollEnabled
					style={{
						backgroundColor: Colors.primary.white,
					}}
					contentContainerStyle={{ alignItems: 'center' }}
					showsVerticalScrollIndicator={false}
				>
					<ImageBackground
						source={BGDark}
						resizeMode='cover'
						imageStyle={{
							height: 225,
							width: width + 50,
							left: -15,
						}}
					>
						<ImageBackground
							resizeMode='cover'
							imageStyle={{
								height: 430,
								width: width,
								marginLeft: -10,
								marginTop: 180,
							}}
							source={BGPink}
						>
							<SafeAreaView style={{ width: width - 20 }}>
								<Back navigate={() => navigation.goBack()} />
								<View>
									<View style={styles.headerContainer}>
										<Text style={sectionTitle}>{topic.title}</Text>
										<View style={styles.barContainer}>
											<Bar
												progress={doneFrames / allFrames.length}
												width={width / 3}
												borderWidth={0}
												unfilledColor='#EAEAEA'
												color={Colors.primary.pink}
												height={8}
												style={{ height: 8 }}
											/>
											<Text style={styles.progrestext}>
												{doneFrames}/{allFrames.length}
											</Text>
										</View>
									</View>
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										horizontal
										data={allFrames}
										renderItem={({ item }) => (
											<TopicRectApp
												width={TopicWidth - 10}
												height={200}
												topic={item}
												setFrames={setFrames}
												navigation={navigation}
											/>
										)}
										keyExtractor={(frame) => frame.id}
									/>
									<Text style={styles.relatedText}>Related Taps</Text>
									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											flexWrap: 'wrap',
											alignItems: 'flex-start',
											justifyContent: 'space-between',
										}}
									>
										{taps.map((tab) => (
											<BigTopicRect
												height={250}
												topic={tab}
												setTabDetail={setTabDetail}
												navigation={navigation}
												key={tab.id}
											/>
										))}
									</View>
								</View>
							</SafeAreaView>
						</ImageBackground>
					</ImageBackground>
				</ScrollView>
			</>
		);
	}

	return <Loading />;
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
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

	relatedText: {
		marginTop: 50,
		marginBottom: 10,
		fontSize: 18,
		color: Colors.primary.white,
	},
});
