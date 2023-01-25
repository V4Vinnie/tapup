import { useContext, useEffect, useState } from 'react';
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
import { useTapsState } from '../../States/Taps';
import { useUserState } from '../../States/User';
import { auth } from '../../firebaseConfig';
import { fetchUserAllWatched } from '../../utils/fetch';

export const Home = ({
	navigation,
	setTopicDetail,
	setTabDetail,
	setLoggedIn,
}) => {
	const taps = useTapsState().get();

	const user = useUserState().get();

	

	const [featureTopics, setFeatureTopics] = useState([]);
	const [filteredTopics, setFilteredTopics] = useState([]);

	const [search, setSearch] = useState(false);
	const [paddingHeight, setPaddingHeight] = useState(110);

	const [bleuHeight, setBleuHeight] = useState(310);

	const [searchValue, setSearchValeu] = useState('');

	useEffect(() => {
		let features = [];
		taps.map(async (tap) => {
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

		searchTopics();
	}, []);

	const searchTopics = () => {
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
		searchTopics();
	}, [searchValue]);

	const TopicWidth = width / 3;

	const onBackClick = () => {
		setPaddingHeight(110);
		setSearch(false);
	};

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
											/>
										)}
										keyExtractor={(topic) => topic.id}
									/>
								</View>
								<View style={styles.section}>
									<Pressable style={styles.dashboardPress}>
										<Text style={styles.dashboardTitle}>Dashboard</Text>
										<View style={{ height: 14, marginLeft: 10 }}>
											<ArrowSmall />
										</View>
									</Pressable>
									<View style={styles.dashboardStats}>
										{user.selectedTopics.length > 3
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
											  })}
									</View>
								</View>
								<View style={styles.topicsPillSection}>
									{taps.map((topic) => {
										return (
											<Pill
												key={topic.id}
												label={topic.title}
												color={Colors.primary.white}
												textColor={Colors.primary.lightBleu}
											/>
										);
									})}
									<Pill
										label={'5m'}
										color={Colors.primary.white}
										textColor={Colors.primary.lightBleu}
									/>
									<Pill
										label={'1h'}
										color={Colors.primary.white}
										textColor={Colors.primary.lightBleu}
									/>
									<Pill
										label={'30s'}
										color={Colors.primary.white}
										textColor={Colors.primary.lightBleu}
									/>
								</View>

								{taps.map((tab) => (
									<View style={styles.section}>
										<Text style={{ ...sectionTitle, color: '#3A3A3A' }}>
											{tab.title}
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
