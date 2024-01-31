import { TNotificationTopic, TProfile, TTopic, TProfile } from '../../types';
import { MOCK_TAPS, MOCK_TOPICS } from './MockData';

export const getTopics = async () => {
	try {
		return MOCK_TOPICS;
	} catch (error) {
		console.log('getTopics in MockTopicService ', error);
	}
};

export const getTopicsForUser = async (user: TProfile) => {
	try {
		const topics =
			(user.topicSubscriptionIds?.map((topicId) => {
				const topic = MOCK_TOPICS.find((topic) => topic.id === topicId);
				if (!topic) return null;
				return {
					...topic,
					notification: Math.floor(Math.random() * 100),
				};
			}) as TNotificationTopic[]) ?? [];

		return new Promise<TNotificationTopic[]>((resolve) => {
			setTimeout(() => {
				resolve(topics);
			}, 1000);
		});
	} catch (error) {
		console.log('getTopicsForUser in MockTopicService ', error);
	}
};

export const getTopicsByCreator = async (profile: TProfile) => {
	try {
		const topics = new Set<TTopic>();
		const frames = profile.madeFrames ?? [];
		frames.forEach((frame) => {
			const tap = MOCK_TAPS.find((tap) => tap.id === frame.tapId);
			if (tap) {
				const topic = MOCK_TOPICS.find(
					(topic) => topic.id === tap.topicId
				);
				if (topic) topics.add(topic);
			}
		});
		return new Promise<TTopic[]>((resolve) => {
			setTimeout(() => {
				resolve(Array.from(topics));
			}, 1000);
		});
	} catch (error) {
		console.log('getTopicsByCreator in MockTopicService ', error);
	}
};
