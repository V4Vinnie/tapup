import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bar } from 'react-native-progress';
import { Colors } from '../Constants/Colors';
import { Topics } from '../Constants/Topics';
import { findTopicById } from '../utils/FindTopic';

export const DashboardProgress = ({ topicId }) => {
	const [doneFrames, setDoneFrames] = useState(0);
	const [topic, setTopic] = useState(null);

	useEffect(() => {
		const _topic = findTopicById(topicId);
		setTopic(_topic);
		let done = 0;
		_topic.frames.map((frame) => {
			if (frame.isDone) {
				done++;
			}
		});
		setDoneFrames(done);
	}, []);

	if (topic !== null) {
		return (
			<View style={styles.container}>
				<View style={styles.textContainer}>
					<Text style={styles.progressText}>{topic.title}</Text>
					<Text style={styles.progressText}>
						{doneFrames}/{topic.frames.length}
					</Text>
				</View>
				<Bar
					progress={doneFrames / topic.frames.length}
					width={null}
					borderWidth={0}
					unfilledColor='#EAEAEA'
					color={Colors.primary.pink}
					height={8}
				/>
			</View>
		);
	}

	return <Text>Loading</Text>;
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
