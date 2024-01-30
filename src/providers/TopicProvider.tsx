import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TNotificationTopic, TTopic, TProfile } from '../types';
import { getTopics, getTopicsForUser } from '../database/services/TopicService';

const TopicContext = React.createContext<{
	loadingInitial: boolean;
	topics: TTopic[];
	getProfileTopics: (user: TProfile) => void;
	userTopics: TNotificationTopic[];
}>({
	loadingInitial: true,
	topics: [],
	getProfileTopics: () => {},
	userTopics: [],
});

type Props = {
	children: React.ReactNode;
};

export const TopicProvider = ({ children }: Props) => {
	const [topics, setTopics] = useState<TTopic[]>([]);
	const [userTopics, seTProfileTopics] = useState<TNotificationTopic[]>([]);
	const [userTopicsDone, seTProfileTopicsDone] = useState<boolean>(false);
	const [allTopicsDone, setAllTopicsDone] = useState<boolean>(false);

	// User topics
	const getProfileTopics = (user: TProfile) => {
		if (!user) return [];
		getTopicsForUser(user).then((topics) => {
			seTProfileTopics(topics ?? []);
			seTProfileTopicsDone(true);
		});
	};

	// All topics
	useEffect(() => {
		const getAllTopics = () => {
			getTopics().then((topics) => {
				setTopics(topics ?? []);
				setAllTopicsDone(true);
			});
		};
		getAllTopics();
	}, []);

	const loadingInitial = useMemo(
		() => !(userTopicsDone && allTopicsDone),
		[userTopicsDone, allTopicsDone]
	);

	const topicProvProps = React.useMemo(
		() => ({
			loadingInitial,
			topics,
			getProfileTopics,
			userTopics,
		}),
		[loadingInitial, topics, getProfileTopics, userTopics]
	);

	return (
		<TopicContext.Provider value={topicProvProps}>
			{children}
		</TopicContext.Provider>
	);
};

export const useTopics = () => {
	return React.useContext(TopicContext);
};
