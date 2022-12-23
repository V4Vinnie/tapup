import { useEffect, useState } from 'react';
import {
	FlatList,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Bar } from 'react-native-progress';
import { Back } from '../../Components/Back';
import { ProfielSearch } from '../../Components/ProfileSearch';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { sectionTitle } from '../../style';
import { width } from '../../utils/UseDimensoins';

export const TopicDetail = ({ navigation, topic }) => {
	const [doneFrames, setDoneFrames] = useState(0);

	useEffect(() => {
		const _topic = topic;
		let done = 0;
		_topic.frames.map((frame) => {
			if (frame.isDone) {
				done++;
			}
		});
		setDoneFrames(done);
	}, []);

	const TopicWidth = width / 3;

	const setFrames = (frame) => {
		console.log('frame', frame);
	};

	return (
		<>
			<ScrollView
				style={{
					backgroundColor: Colors.primary.bleuBottom,
				}}
				contentContainerStyle={{ alignItems: 'center' }}
			>
				<SafeAreaView style={{ width: width - 20 }}>
					<Back navigate={() => navigation.goBack()} />
					<View>
						<View style={styles.headerContainer}>
							<Text style={sectionTitle}>{topic.title}</Text>
							<View style={styles.barContainer}>
								<Bar
									progress={doneFrames / topic.frames.length}
									width={width / 3}
									borderWidth={0}
									unfilledColor='#EAEAEA'
									color={Colors.primary.pink}
									height={8}
									style={{ height: 8 }}
								/>
								<Text style={styles.progrestext}>
									{doneFrames}/{topic.frames.length}
								</Text>
							</View>
						</View>
						<FlatList
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							horizontal
							data={topic.frames}
							renderItem={({ item }) => (
								<TopicRectApp
									width={TopicWidth - 10}
									height={200}
									topic={item}
									setFrames={setFrames}
									navigation={navigation}
								/>
							)}
							keyExtractor={(topic) => topic.id}
						/>
					</View>
				</SafeAreaView>
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
});
