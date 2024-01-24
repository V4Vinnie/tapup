import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TNotificationTopic, TTopic, TUser } from '../types';
import {
	getTopics,
	getTopicsForUser,
} from '../database/services/MockTopicService';

const TopicContext = React.createContext<{
	loadingInitial: boolean;
	topics: TTopic[];
	getUserTopics: (user: TUser) => void;
	userTopics: TNotificationTopic[];
}>({
	loadingInitial: true,
	topics: [],
	getUserTopics: () => {},
	userTopics: [],
});

type Props = {
	children: React.ReactNode;
};

export const TopicProvider = ({ children }: Props) => {
	const [topics, setTopics] = useState<TTopic[]>([]);
	const [userTopics, setUserTopics] = useState<TNotificationTopic[]>([]);
	const [userTopicsDone, setUserTopicsDone] = useState<boolean>(false);
	const [allTopicsDone, setAllTopicsDone] = useState<boolean>(false);

	// User topics
	const getUserTopics = (user: TUser) => {
		if (!user) return [];
		getTopicsForUser(user).then((topics) => {
			setUserTopics(topics ?? []);
			setUserTopicsDone(true);
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
			getUserTopics,
			userTopics,
		}),
		[loadingInitial, topics, getUserTopics, userTopics]
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
