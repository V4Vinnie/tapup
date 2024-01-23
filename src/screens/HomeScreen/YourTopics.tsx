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
	const { getUserTopics, topics, loadingInitial } = useTopics();
	const isFocused = useIsFocused();
	const [yourTopics, setYourTopics] = React.useState<TNotificationTopic[]>(
		[]
	);

	useEffect(() => {
		if (!user?.uid) return;
		const userTopics = (user: TUser) => {
			getUserTopics(user)
				.then((topics) => {
					const sortedTopics = [...topics].sort(
						(a, b) => b.notification - a.notification
					);
					setYourTopics(sortedTopics);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		if (isFocused) userTopics(user);
		onUser(user.uid, userTopics);
	}, [isFocused, user?.topicSubscriptionIds]);

	if (yourTopics.length === 0)
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
						topics: yourTopics,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : (
				// TODO: Fix onPress
				<TagRow data={yourTopics} />
			)}
		</>
	);
};

export default YourTopics;
