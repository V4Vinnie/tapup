import React, { useEffect } from 'react';
import { useTopics } from '../../providers/TopicProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { TNotificationTopic, TTopic, TUser } from '../../types';
import { onUser } from '../../database/services/UserService';
import LoadingIndicator from '../../components/LoadingIndicator';
import SectionHeader from '../../components/SectionHeader';
import TagRow from '../../components/TagRow';

const YourTopics = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getUserTopics, userTopics, topics, loadingInitial } = useTopics();
	const isFocused = useIsFocused();

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getUserTopics(user);
		onUser(user.uid, getUserTopics);
	}, [isFocused, user]);

	if (userTopics.length === 0)
		return (
			<>
				<SectionHeader
					title='Discover Topics'
					onPress={() =>
						navigate(Routes.SEE_MORE_TOPICS, {
							title: 'Discover Topics',
							topics,
						})
					}
				/>
				<TagRow data={topics} />
			</>
		);
	return (
		<>
			<SectionHeader
				title='Your topics'
				onPress={() =>
					navigate(Routes.SEE_MORE_TOPICS, {
						title: 'Your topics',
						topics: userTopics,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : (
				// TODO: Fix onPress
				<TagRow data={userTopics} />
			)}
		</>
	);
};

export default YourTopics;
