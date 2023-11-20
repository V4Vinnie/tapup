import { useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	StyleSheet,
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
import { fetchFrames } from '../../utils/fetch';
import { useTaps } from '../../Providers/TapsProvider';
import { useUser } from '../../Providers/UserProvider';
import { useIsFocused } from '@react-navigation/native';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';
import { BoldText } from '../../Components/Text/BoldText';

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

	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		const getTabs = async () => {
			setAllFrames(null);
			setIsFetching(true);
			const tap = findTabByTopicId(taps, topic.id);
			const _frames = await fetchFrames(tap.id, topic.id);
			let done = 0;

			if (user.watchedFrames) {
				user.watchedFrames.map((frame) => {
					if (frame.isDone) {
						if (done !== _frames.length) {
							done++;
						}
					}
				});
			}

			setDoneFrames(done);
			setAllFrames(_frames);
			console.log('Finished set ALL');
			setIsFetching(false);
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
							<View
								style={{
									width: '100%',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginTop: 15,
								}}
							>
								<MediumText
									style={{
										...sectionTitle,
										maxWidth: '75%',
										textAlign: 'left',
										marginTop: 0,
									}}
								>
									{topic.title}
								</MediumText>

								<Bar
									progress={
										allFrames.length === 0 ? 0 : doneFrames / allFrames.length
									}
									width={width / 3}
									borderWidth={0}
									unfilledColor='#EAEAEA'
									color={Colors.primary.pink}
									height={8}
									style={{ height: 8 }}
								/>
							</View>
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
									topic.img.includes('/')
										? { uri: topic.img }
										: {
												uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/topics%2F${topic.id}%2F${topic.img}?alt=media`,
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
										opacity: 0.7,
									}}
									source={BGPink}
								>
									<RegularText style={{ color: Colors.primary.white }}>
										{topic.description}
									</RegularText>
								</ImageBackground>
							</ImageBackground>
						</View>

						<View style={styles.bigItemsConainer}>
							{!isFetching && (
								<>
									{allFrames.length === 0 ? (
										<>
											{console.log('VISUAL')}
											<BoldText
												style={{ fontSize: 20, color: Colors.primary.white }}
											>
												No frames in this topic
											</BoldText>
										</>
									) : allFrames.length > 1 ? (
										<>
											<BigTopicRect
												width={width / 2 - 50}
												height={300}
												topic={allFrames[0]}
												setFrames={setFrames}
												navigation={navigation}
											/>
											<BigTopicRect
												width={width / 2 - 10}
												height={300}
												topic={allFrames[1]}
												setFrames={setFrames}
												navigation={navigation}
											/>
										</>
									) : (
										<BigTopicRect
											width={width / 2 - 10}
											height={300}
											topic={allFrames[0]}
											setFrames={setFrames}
											navigation={navigation}
										/>
									)}
								</>
							)}
						</View>
						<MediumText style={styles.moreMediumText}>
							{allFrames.length === 0 ? '' : 'More'}
						</MediumText>
						{allFrames.length > 0 && (
							<FlatList
								style={{ marginBottom: 150 }}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								numColumns={3}
								data={allFrames}
								renderItem={({ item }) => (
									<>
										<TopicRectApp
											width={TopicWidth - 10}
											height={200}
											topic={item}
											setFrames={setFrames}
											navigation={navigation}
										/>
									</>
								)}
								keyExtractor={(frame) => frame.id}
							/>
						)}
					</ScrollView>
				</SafeAreaView>
			</>
		);
	}

	return <Loading />;
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

	relatedText: {
		marginTop: 50,
		marginBottom: 10,
		fontSize: 18,
		color: Colors.primary.white,
	},

	bigItemsConainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		marginTop: 30,
	},

	moreText: {
		fontSize: 18,
	},
});
