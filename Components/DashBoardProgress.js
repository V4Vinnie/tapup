import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bar } from 'react-native-progress';
import { Colors } from '../Constants/Colors';
import { useTaps } from '../Providers/TapsProvider';
import { useUser } from '../Providers/UserProvider';
import { fetchFrames, getWatchedFramesByTopicId } from '../utils/fetch';
import { findWatchedFrameById } from '../utils/findById';
import { findTopicById } from '../utils/FindTopic';

export const DashboardProgress = ({ topicId }) => {
	const { taps } = useTaps();
	const { user } = useUser();
	const [doneFrames, setDoneFrames] = useState(0);
	const [allFramesLength, setAllFramesLength] = useState(0);
	const [topic, setTopic] = useState(null);
	const isFocused = useIsFocused();
	useEffect(() => {
		const fetchTopic = async () => {
			const { fetchedTopic, index } = await findTopicById(taps, topicId);
			let _topic = fetchedTopic;
			const _watchedFrames = findWatchedFrameById(
				user.watchedFrames,
				_topic.id
			);
			const allFrames = await fetchFrames(taps[index].id, _topic.id);

			let done = 0;

			if (_watchedFrames) {
				_watchedFrames.map((frame) => {
					if (frame.isDone) {
						done++;
					}
				});
			}
			setAllFramesLength(allFrames.length);
			setDoneFrames(done);
			setTopic(_topic);
		};

		fetchTopic();
	}, [isFocused]);

	if (topic !== null) {
		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					<Text style={styles.progressText}>{topic.title}</Text>
					<Text style={styles.progressText}>
						{doneFrames}/{allFramesLength}
					</Text>
				</View>
				<Bar
					progress={doneFrames / allFramesLength}
					width={null}
					borderWidth={0}
					unfilledColor='#EAEAEA'
					color={Colors.primary.pink}
					height={8}
				/>
			</View>
		);
	}

	return <Text>Loading...</Text>;
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
	},
	textContainer: {
		width: '100%',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginBottom: 5,
	},

	progressText: {
		fontSize: 12,
		color: Colors.primary.black,
	},
});
