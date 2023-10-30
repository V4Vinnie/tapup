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
import { width } from '../../utils/UseDimensoins';
import BGPink from '../../assets/logo/pinkBG.png';
import BGDark from '../../assets/logo/darkBG.png';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';

export const TabDetail = ({ navigation, tab, setTopicDetail }) => {
	const [moreTopics, setMoreTopics] = useState([]);

	const TopicWidth = width / 3;

	useEffect(() => {
		setMoreTopics(tab.topics.slice(2, tab.topics.length));
	}, []);

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
							{tab.title}
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
								tab.img.includes('/')
									? { uri: tab.img }
									: {
											uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${tab.id}%2F${tab.img}?alt=media`,
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
									opacity: 0.8,
								}}
								source={BGPink}
							>
								<RegularText style={{ color: Colors.primary.white }}>
									{tab.description}
								</RegularText>
							</ImageBackground>
						</ImageBackground>
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
					<MediumText style={styles.moreText}>
						{moreTopics.length === 0 ? '' : 'More'}
					</MediumText>
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
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'column',
		width: '100%',
		alignItems: 'start',
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
		color: Colors.primary.white,
	},
});
