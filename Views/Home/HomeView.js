import { useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	View,
	ScrollView,
	StyleSheet,
	RefreshControl,
} from 'react-native';
import BGBleu from '../../assets/logo/bleuBG.png';
import BGDark from '../../assets/longDarkTop.png';
import { Pill } from '../../Components/Pill';
import { height, width } from '../../utils/UseDimensoins';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { useTaps } from '../../Providers/TapsProvider';
import { useUser } from '../../Providers/UserProvider';
import {
	fetchCreators,
	fetchFrameById,
	fetchTaps,
	fetchTopics,
} from '../../utils/fetch';
import { MediumText } from '../../Components/Text/MediumText';
import { BoldText } from '../../Components/Text/BoldText';
import { useIsFocused } from '@react-navigation/native';
import { LoadingContent } from '../../Components/LoadingContent';

export const HomeView = ({
	navigation,
	setTopicDetail,
	setTabDetail,
	setViewFrame,
	setLoggedIn,
}) => {
	const { taps, setTaps } = useTaps();

	const { user, setUser } = useUser();

	const [featureTopics, setFeatureTopics] = useState([]);
	const [filteredTopics, setFilteredTopics] = useState([]);

	const [userWatched, setUserWatched] = useState(undefined);
	const [creators, setCreators] = useState(undefined);

	const [refreshing, setRefreshing] = useState();

	const [isLoading, setIsLoading] = useState(false);

	const getAll = async () => {
		setIsLoading(true);
		const Taps = await fetchTaps();

		const _taps = [];

		for (let i = 0; i < Taps.length; i++) {
			let tap = Taps[i];
			let _topics = await fetchTopics(tap.id);

			tap.topics = _topics;

			_taps.push(tap);
		}
		setTaps(_taps);

		let features = [];
		_taps.map(async (tap) => {
			if (tap.isFeature) {
				features.push(tap);
			}
		});
		setFeatureTopics(features);

		searchTopics(_taps);

		setRefreshing(false);
		setIsLoading(false);
	};

	const getCreators = async () => {
		const _creators = await fetchCreators();
		setCreators(_creators);
	};

	useEffect(() => {
		getAll();
		getCreators();
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getAll();
	}, []);

	const isFocused = useIsFocused();

	useEffect(() => {
		const getFramesDetail = async () => {
			if (user && user.watchedFrames) {
				let allWatched = [];
				for (let ind = 0; ind < user.watchedFrames.length; ind++) {
					const watched = user.watchedFrames[ind];

					if (!watched.isDone) {
						const _watchedFrame = await fetchFrameById(watched.frameLink);
						if (_watchedFrame) {
							allWatched.push(_watchedFrame);
						}
					}
				}

				setUserWatched(allWatched);
			}
		};

		getFramesDetail();
	}, [isFocused, user]);

	const searchTopics = (taps) => {
		let _filteredTopics = [];
		taps.map((tap) => {
			tap.topics.map((topic) => {
				_filteredTopics.push(topic);
			});
		});

		setFilteredTopics(_filteredTopics);
	};

	const TopicWidth = width / 3;

	// if (!taps) {
	// 	return <Loading />;
	// }

	const setFrames = (frame) => {
		setViewFrame(frame);
		navigation.navigate('frames');
	};

	return (
		<>
			<SafeAreaView
				style={{
					backgroundColor: `#1C2239`,
				}}
			/>
			<SafeAreaView
				style={{
					backgroundColor: Colors.primary.white,
				}}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					style={{}}
				>
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					<View style={styles.container}>
						<ImageBackground
							resizeMode='cover'
							imageStyle={{
								width: width,
								height: 380,
								top: 0,
								left: -10,
							}}
							source={BGDark}
						>
							<View style={styles.section}>
								<MediumText style={sectionTitle}>Feature Taps</MediumText>
								{featureTopics && !refreshing ? (
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										scrollEnabled={false}
										numColumns={3}
										data={featureTopics}
										renderItem={({ item }) => (
											<TopicRectApp
												width={TopicWidth - 11}
												height={200}
												topic={item}
												setTabDetail={setTabDetail}
												navigation={navigation}
												key={item.id}
											/>
										)}
										keyExtractor={(topic) => topic.id}
									/>
								) : (
									<LoadingContent />
								)}
							</View>
							<ImageBackground
								resizeMode='stretch'
								imageStyle={{
									height: 300,
									left: -11,
									width: width + 2,
								}}
								source={BGBleu}
							>
								<View style={{ ...styles.section, marginTop: 20 }}>
									<MediumText style={sectionTitle}>Keep watching</MediumText>
									{userWatched && !refreshing ? (
										<>
											{userWatched.length === 0 ? (
												<View
													style={{
														height: 200,
														flexDirection: 'row',
														width: width,
													}}
												>
													<BoldText
														style={{
															fontSize: 50,
															lineHeight: 50,
															color: Colors.primary.bleuBottom,
															opacity: 0.2,
															textTransform: 'uppercase',
															marginTop: 5,
														}}
													>
														You have no frames in progres
													</BoldText>
												</View>
											) : (
												<FlatList
													showsVerticalScrollIndicator={false}
													showsHorizontalScrollIndicator={false}
													horizontal
													style={{ overflow: 'visible' }}
													data={userWatched}
													renderItem={({ item }) => (
														<TopicRectApp
															width={TopicWidth - 11}
															height={200}
															topic={item}
															setFrames={setFrames}
															navigation={navigation}
															key={item.id}
														/>
													)}
													keyExtractor={(topic) => topic.id}
												/>
											)}
										</>
									) : (
										<LoadingContent indicationColor={Colors.primary.white} />
									)}
								</View>
							</ImageBackground>
							<View style={styles.topicsPillSection}>
								{taps && !refreshing ? (
									taps.map((tap) => {
										return (
											<Pill
												key={tap.id}
												tap={tap}
												color={Colors.primary.white}
												textColor={Colors.primary.lightBleu}
												setTabDetail={setTabDetail}
												navigation={navigation}
											/>
										);
									})
								) : (
									<LoadingContent />
								)}
							</View>
							<View style={{ backgroundColor: Colors.primary.white }}>
								{taps && !refreshing ? (
									taps.map((tab) => (
										<View style={styles.section}>
											<MediumText style={{ ...sectionTitle, color: '#3A3A3A' }}>
												{tab.title} Taps
											</MediumText>
											<FlatList
												showsVerticalScrollIndicator={false}
												showsHorizontalScrollIndicator={false}
												horizontal
												data={tab.topics}
												style={{ overflow: 'visible' }}
												renderItem={({ item }) => (
													<TopicRectApp
														width={TopicWidth - 10}
														height={200}
														topic={item}
														setTopicDetail={setTopicDetail}
														navigation={navigation}
														key={item.id}
													/>
												)}
												keyExtractor={(topic) => topic.id}
											/>
										</View>
									))
								) : (
									<LoadingContent />
								)}
							</View>
						</ImageBackground>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const sectionWidth = width - 20;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '100%',
		marginBottom: height / 3,
		backgroundColor: Colors.primary.white,
	},

	section: {
		width: sectionWidth,
		marginBottom: 20,
	},

	dashboardTitle: {
		...sectionTitle,
		fontSize: 18,
		textAlign: 'center',
	},

	dashboardStats: {
		padding: 20,
		backgroundColor: Colors.primary.white,
		borderRadius: 5,

		shadowColor: '#rgba(23, 23, 23, 0.50)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 6,
	},

	dashboardPress: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	topicsPillSection: {
		width: sectionWidth,
		marginBottom: 20,
		marginTop: 15,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
});
