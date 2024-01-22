import { TNotificationTopic, TTopic, TUser } from '../../types';

export const getTopics = async () => {
	try {
		return MOCK_TOPICS;
	} catch (error) {
		console.log('getTopics in MockTopicService ', error);
	}
};

export const getTopicsForUser = async (user: TUser) => {
	try {
		const _topics =
			(user.topicSubscriptionIds?.map((topicId) => {
				const topic = MOCK_TOPICS.find((topic) => topic.id === topicId);
				if (!topic) return null;
				return {
					...topic,
					notification: Math.random() > 0.5,
				};
			}) as TNotificationTopic[]) ?? [];

		// wait for 1 second to simulate network latency
		return new Promise<TNotificationTopic[]>((resolve) => {
			setTimeout(() => {
				resolve(_topics);
			}, 1000);
		});
	} catch (error) {
		console.log('getTopicsForUser in MockTopicService ', error);
	}
};

const MOCK_TOPICS: TTopic[] = [
	{
		id: '25b5f4be-bff4-4d5a-a734-b38e3fc1d40b',
		name: 'Coding',
	},
	{
		id: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		name: 'Entrepreneurship',
	},
	{
		id: '8a415c6b-d8e1-43dd-bbb4-89ac0158caee',
		name: 'Design',
	},
	{
		id: 'fd6d97b5-849b-4b6a-9059-bfb2bb34de6c',
		name: 'Marketing',
	},
	{
		id: 'd5b48269-a55c-4524-b473-c19ccf563196',
		name: 'Productivity',
	},
];
