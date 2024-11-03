import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TNotificationTopic, TTopic, TProfile } from '../types';
import { getTopics, getTopicsForUser } from '../database/services/TopicService';

const topicInitial = {
	loadingInitial: true,
	topics: [],
	getProfileTopics: () => {},
	userTopics: [],
	allTopicsDone: false,
	resetState: () => {},
};

const TopicContext = React.createContext<{
	loadingInitial: boolean;
	topics: TTopic[];
	getProfileTopics: (user: TProfile) => void;
	userTopics: TNotificationTopic[];
	resetState: () => void;
}>(topicInitial);

type Props = {
	children: React.ReactNode;
};

export const TopicProvider = ({ children }: Props) => {
	const [topics, setTopics] = useState<TTopic[]>(topicInitial.topics);
	const [userTopics, setUserTopics] = useState<TNotificationTopic[]>(
		topicInitial.userTopics
	);
	const [allTopicsDone, setAllTopicsDone] = useState<boolean>(
		topicInitial.allTopicsDone
	);

	// User topics
	const getProfileTopics = (user: TProfile) => {
		if (!user) return [];
		getTopicsForUser(user).then((topics) => {
			setUserTopics(topics ?? []);
		});
	};

	const resetState = () => {
		setTopics(topicInitial.topics);
		setUserTopics(topicInitial.userTopics);
		setAllTopicsDone(topicInitial.allTopicsDone);
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

	const loadingInitial = !allTopicsDone;

	const topicProvProps = React.useMemo(
		() => ({
			loadingInitial,
			topics,
			getProfileTopics,
			userTopics,
			resetState,
		}),
		[loadingInitial, topics, getProfileTopics, userTopics, resetState]
	);

	return (
		<TopicContext.Provider value={topicProvProps}>
			{loadingInitial ? null : children}
		</TopicContext.Provider>
	);
};

export const useTopics = () => {
	return React.useContext(TopicContext);
};
