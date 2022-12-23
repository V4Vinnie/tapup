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
import { Topics } from '../../Constants/Topics';
import { sectionTitle } from '../../style';
import { width } from '../../utils/UseDimensoins';

import BGBleu from '../../assets/logo/bleuBG.png';
import BGWhite from '../../assets/logo/whiteBG.png';
import { Pill } from '../../Components/Pill';
import { ProfielSearch } from '../../Components/ProfileSearch';
import { Back } from '../../Components/Back';

export const Home = ({ navigation, user, setTopicDetail }) => {
	console.log(user);
	const [featureTopics, setFeatureTopics] = useState([]);
	const [filteredTopics, setFilteredTopics] = useState(Topics);

	const [search, setSearch] = useState(false);
	const [paddingHeight, setPaddingHeight] = useState(110);

	const [searchValue, setSearchValeu] = useState('');

	useEffect(() => {
		let features = [];
		Topics.map((topic) => {
			if (topic.isFeature) {
				features.push(topic);
			}
		});
		setFeatureTopics(features);
	}, []);

	useEffect(() => {
		if (searchValue === '') {
			setFilteredTopics(Topics);
		} else {
			let _filteredTopics = [];
			Topics.map((topic) => {
				if (
					topic.title
						.toLocaleLowerCase()
						.includes(searchValue.toLocaleLowerCase())
				) {
					_filteredTopics.push(topic);
				}
			});
			setFilteredTopics(_filteredTopics);
		}
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
				setPaddingHeight={setPaddingHeight}
			/>
			<ScrollView
				style={{ backgroundColor: Colors.primary.bleuBottom }}
				contentInsetAdjustmentBehavior='automatic'
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				{search ? (
					<SafeAreaView>
						<View style={{ marginLeft: 10, marginBottom: 10 }}>
							<Back navigate={() => onBackClick()} />
						</View>
						<View style={{ alignItems: 'center' }}>
							<FlatList
								contentContainerStyle={{
									width: width - 15,
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
						resizeMode='cover'
						imageStyle={{
							height: 430,
							marginTop: 120,
						}}
						source={BGBleu}
					>
						<SafeAreaView style={styles.container}>
							<View style={styles.section}>
								<Text style={sectionTitle}>Feature Taps</Text>
								<FlatList
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									horizontal
									data={featureTopics}
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
													<DashboardProgress key={topicId} topicId={topicId} />
												);
										  })
										: user.selectedTopics.map((topicId) => {
												return (
													<DashboardProgress key={topicId} topicId={topicId} />
												);
										  })}
								</View>
							</View>
							<ImageBackground
								resizeMode='cover'
								imageStyle={{
									width: width,
									height: 1000,
									marginTop: 60,
									left: -10,
								}}
								source={BGWhite}
							>
								<View style={styles.topicsPillSection}>
									{Topics.map((topic) => {
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
								<View style={styles.section}>
									<Text style={{ ...sectionTitle, color: '#3A3A3A' }}>
										Feature AI Taps
									</Text>
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										horizontal
										data={featureTopics}
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
								<View style={styles.section}>
									<Text style={{ ...sectionTitle, color: '#3A3A3A' }}>
										Feature Entrepreneurship Taps
									</Text>
									<FlatList
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										horizontal
										data={featureTopics}
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
							</ImageBackground>
						</SafeAreaView>
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
