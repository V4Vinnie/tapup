import { Topics } from '../Constants/Topics';

export const findTopicById = (topicId) => {
	return Topics.find((topic) => topic.id === topicId);
};
