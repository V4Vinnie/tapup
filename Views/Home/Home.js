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
import { DashboardProgress } from '../../Components/DashBoardProgress';

import { ArrowSmall } from '../../Components/SVG/ArrowSmall';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { width } from '../../utils/UseDimensoins';

import BGBleu from '../../assets/logo/bleuBG.png';
import BGDark from '../../assets/logo/darkBG.png';
import { Pill } from '../../Components/Pill';
import { ProfielSearch } from '../../Components/ProfileSearch';
import { Back } from '../../Components/Back';
import { useUser } from '../../Providers/UserProvider';
import { useTaps } from '../../Providers/TapsProvider';
import { fetchTaps, fetchTopics, fetchUserAllWatched } from '../../utils/fetch';
import { Loading } from '../../Components/Loading';

export const Home = ({
	navigation,
	setTopicDetail,
	setTabDetail,
	setLoggedIn,
}) => {
	const { taps, setTaps } = useTaps();

	const { user, setUser } = useUser();

	const [featureTopics, setFeatureTopics] = useState([]);
	const [filteredTopics, setFilteredTopics] = useState([]);

	const [search, setSearch] = useState(false);
	const [paddingHeight, setPaddingHeight] = useState(110);

	const [bleuHeight, setBleuHeight] = useState(310);

	const [searchValue, setSearchValeu] = useState('');

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
			if (user.selectedTopics.length === 1) {
				setBleuHeight(310);
			} else if (user.selectedTopics.length === 2) {
				setBleuHeight(350);
			} else {
				setBleuHeight(390);
			}

			searchTopics(_taps);

			if (!user.watchedFrames) {
				getWatchedFrames();
			}
		};
		test();
	}, []);

	const getWatchedFrames = async () => {
		const _watchedFrames = await fetchUserAllWatched(user.id);
		let _user = { ...user };
		_user.watchedFrames = _watchedFrames;
		setUser(_user);
	};

	const searchTopics = (taps) => {
		let _filteredTopics = [];
		taps.map((tap) => {
			tap.topics.map((topic) => {
				if (searchValue === '') {
					_filteredTopics.push(topic);
				} else if (
					topic.title
						.toLocaleLowerCase()
						.includes(searchValue.toLocaleLowerCase())
				) {
					_filteredTopics.push(topic);
				}
			});
		});

		setFilteredTopics(_filteredTopics);
	};

	useEffect(() => {
		if (taps) {
			searchTopics(taps);
		}
	}, [searchValue]);

	const TopicWidth = width / 3;

	const onBackClick = () => {
		setPaddingHeight(110);
		setSearch(false);
	};

	const goDashboard = () => {
		navigation.navigate('profile');
	};
	if (!taps) {
		return <Loading />;
	}
	return (
		<>
			<ProfielSearch
				showInput={search}
				setSearch={setSearch}
				searchValue={searchValue}
				setSearchValue={setSearchValeu}
				userImg={user.profilePic}
				paddingHeight={paddingHeight}
				setLoggedIn={setLoggedIn}
				setPaddingHeight={setPaddingHeight}
				navigation={navigation}
			/>
			<ScrollView
				nestedScrollEnabled
				contentInsetAdjustmentBehavior='automatic'
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				style={
					search
						? { backgroundColor: Colors.primary.bleuBottom }
						: { backgroundColor: Colors.primary.white }
				}
			>
				{search ? (
					<SafeAreaView>
						<View style={{ marginLeft: 10, marginBottom: 10 }}>
							<Back navigate={() => onBackClick()} />
						</View>
						<View style={{ alignItems: 'center' }}>
							<FlatList
								contentContainerStyle={{
									width: width,
									alignItems: 'flex-start',
								}}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								data={filteredTopics}
								numColumns={3}
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
					</SafeAreaView>
				) : (
					<ImageBackground
						resizeMode='strech'
						imageStyle={{
							height: bleuHeight,
							top: 120,
						}}
						source={BGBleu}
					>
						<ImageBackground
							resizeMode='cover'
							imageStyle={{
								width: width,
								height: 226.5,
								top: -50,
							}}
							source={BGDark}
						>
							<SafeAreaView style={styles.container}>
								<View style={styles.section}>
									<Text style={sectionTitle}>Feature Taps</Text>
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
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
								</View>
								<View style={styles.section}>
									<Pressable
										style={styles.dashboardPress}
										onPress={() => goDashboard()}
									>
										<Text style={styles.dashboardTitle}>Dashboard</Text>
										<View style={{ height: 14, marginLeft: 10 }}>
											<ArrowSmall />
										</View>
									</Pressable>
									<View style={styles.dashboardStats}>
										{user.watchedFrames
											? user.selectedTopics.length > 3
												? user.selectedTopics.slice(0, 3).map((topicId) => {
														return (
															<DashboardProgress
																key={topicId}
																topicId={topicId}
															/>
														);
												  })
												: user.selectedTopics.map((topicId) => {
														return (
															<DashboardProgress
																key={topicId}
																topicId={topicId}
															/>
														);
												  })
											: null}
									</View>
								</View>
								<View style={styles.topicsPillSection}>
									{taps.map((tap) => {
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
									})}
								</View>

								{taps.map((tab) => (
									<View style={styles.section}>
										<Text style={{ ...sectionTitle, color: '#3A3A3A' }}>
											{tab.title} Taps
										</Text>
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
								))}
							</SafeAreaView>
						</ImageBackground>
					</ImageBackground>
				)}
			</ScrollView>
		</>
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
