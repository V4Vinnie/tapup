import React, { useEffect } from 'react';
import { useTopics } from '../../providers/TopicProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { TNotificationTopic, TTopic } from '../../types';
import { onUser } from '../../database/services/UserService';
import LoadingIndicator from '../../components/LoadingIndicator';
import SectionHeader from '../../components/SectionHeader';
import TagRow from '../../components/TagRow';

const YourTopics = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getUserTopics, loadingInitial } = useTopics();
	const isFocused = useIsFocused();
	const [yourTopics, setYourTopics] = React.useState<TNotificationTopic[]>(
		[]
	);

	useEffect(() => {
		if (!user?.uid) return;
		const userTopics = () => {
			getUserTopics()
				.then((topics) => {
					const sortedTopics = topics.sort(
						(a, b) => b.notification - a.notification
					);
					setYourTopics(sortedTopics);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		if (isFocused) userTopics();
		onUser(user.uid, userTopics);
	}, [isFocused, user]);

	return (
		<>
			<SectionHeader
				title='Your topics'
				onPress={() =>
					navigate(Routes.GENERAL_SEE_MORE, {
						title: 'Your topics',
						data: yourTopics,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : // TODO: Fix onPress
			yourTopics.length === 0 ? null : (
				<TagRow data={yourTopics} />
			)}
		</>
	);
};

export default YourTopics;
