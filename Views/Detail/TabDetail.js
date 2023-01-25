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
import { Back } from '../../Components/Back';
import { BigTopicRect } from '../../Components/BigTopicRect';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { height, width } from '../../utils/UseDimensoins';
import BGPink from '../../assets/logo/pinkBG.png';
import BGDark from '../../assets/logo/darkBG.png';

export const TabDetail = ({ navigation, tab, setTopicDetail }) => {
	const [moreTopics, setMoreTopics] = useState([]);

	const TopicWidth = width / 3;

	useEffect(() => {
		setMoreTopics(tab.topics.slice(2, tab.topics.length));
	}, []);

	return (
		<>
			<ScrollView
				nestedScrollEnabled
				style={{
					backgroundColor: Colors.primary.white,
				}}
				contentContainerStyle={{ alignItems: 'center' }}
			>
				<ImageBackground
					source={BGDark}
					resizeMode='cover'
					imageStyle={{
						height: 225,
						width: width,
						left: -10,
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
							<View style={styles.headerContainer}>
								<Back navigate={() => navigation.goBack()} />
								<Text
									style={{
										...sectionTitle,
										maxWidth: '75%',
										textAlign: 'right',
									}}
								>
									{tab.title}
								</Text>
							</View>
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
							<Text style={styles.moreText}>More</Text>
							<FlatList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								numColumns={3}
								data={moreTopics}
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
						</SafeAreaView>
					</ImageBackground>
				</ImageBackground>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10,
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
	},

	moreText: {
		fontSize: 18,
		color: Colors.primary.white,
	},
});
