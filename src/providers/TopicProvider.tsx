import React, { useEffect, useState } from 'react';
import { TNotificationTopic, TTopic, TUser } from '../types';
import { useAuth } from './AuthProvider';
import {
	getTopics,
	getTopicsForUser,
} from '../database/services/MockTopicService';

const TopicContext = React.createContext<{
	loadingInitial: boolean;
	topics: TTopic[];
	getUserTopics: (user: TUser) => Promise<TNotificationTopic[]>;
}>({
	loadingInitial: true,
	topics: [],
	getUserTopics: async () => [],
});

type Props = {
	children: React.ReactNode;
};

export const TopicProvider = ({ children }: Props) => {
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
	const [topics, setTopics] = useState<TTopic[]>([]);

	// User topics
	const getUserTopics = async (user: TUser) => {
		if (!user) return [];
		const _userTopics = await getTopicsForUser(user);
		setLoadingInitial(typeof _userTopics === 'undefined');
		return _userTopics ?? [];
	};

	// All topics
	useEffect(() => {
		const getAllTopics = async () => {
			const _allTopics = await getTopics();
			setTopics(_allTopics ?? []);
		};
		getAllTopics();
	}, []);

	const topicProvProps = React.useMemo(
		() => ({
			loadingInitial,
			topics,
			getUserTopics,
		}),
		[loadingInitial, topics, getUserTopics]
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
