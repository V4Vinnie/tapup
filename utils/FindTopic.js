export const findTopicById = (taps, topicId) => {
	let foundedTopic;

	let _index;

	taps.map((tab, index) => {
		tab.topics.map((topic) => {
			if (topic.id === topicId) {
				foundedTopic = topic;
				_index = index;
			}
		});
	});

	return { fetchedTopic: foundedTopic, index: _index };
};
