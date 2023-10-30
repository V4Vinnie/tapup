import { useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	View,
	ScrollView,
} from 'react-native';
import BGBleu from '../../assets/logo/bleuBG.png';
import BGDark from '../../assets/longDarkTop.png';
import { Pill } from '../../Components/Pill';
import { width } from '../../utils/UseDimensoins';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { useTaps } from '../../Providers/TapsProvider';
import { useUser } from '../../Providers/UserProvider';
import { fetchFrameById, fetchTaps, fetchTopics } from '../../utils/fetch';
import { MediumText } from '../../Components/Text/MediumText';
import { BoldText } from '../../Components/Text/BoldText';
import { useIsFocused } from '@react-navigation/native';

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

	useEffect(() => {
		//signOut(auth);
		const test = async () => {
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
		};
		test();
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
		<ScrollView
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			style={{
				backgroundColor: Colors.primary.white,
			}}
		>
			<ImageBackground
				resizeMode='cover'
				imageStyle={{
					width: width,
					height: 380,
					top: 0,
				}}
				source={BGDark}
			>
				<SafeAreaView style={styles.container}>
					<View style={styles.section}>
						<MediumText style={sectionTitle}>Feature Taps</MediumText>
						{featureTopics ? (
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
							<BoldText>Loading...</BoldText>
						)}
					</View>
					<ImageBackground
						resizeMode='strech'
						imageStyle={{
							height: 300,
							left: -11,
							width: width + 2,
						}}
						source={BGBleu}
					>
						<View style={{ ...styles.section, marginTop: 20 }}>
							<MediumText style={sectionTitle}>Keep watching</MediumText>
							{userWatched ? (
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
								<BoldText>Loading...</BoldText>
							)}
						</View>
					</ImageBackground>
					<View style={styles.topicsPillSection}>
						{taps ? (
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
							<BoldText>Loading...</BoldText>
						)}
					</View>

					{taps ? (
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
						<BoldText>Loading...</BoldText>
					)}
				</SafeAreaView>
			</ImageBackground>
		</ScrollView>
	);
};

const sectionWidth = width - 20;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '100%',
		marginBottom: 80,
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
