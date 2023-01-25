export const findTabByTopicId = (taps, topicId) => {
	let tapIndex = undefined;
	taps.map((tap, index) => {
		tap.topics.map((topic) => {
			if (topic.id === topicId) {
				tapIndex = index;
			}
		});
	});
	return taps[tapIndex].id;
};
