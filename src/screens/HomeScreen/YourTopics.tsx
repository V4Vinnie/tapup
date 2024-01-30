import React, { useEffect } from 'react';
import { useTopics } from '../../providers/TopicProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import TagRow, { TagRowSkeleton } from '../../components/TagRow';

const YourTopics = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getProfileTopics, userTopics, topics, loadingInitial } =
		useTopics();
	const isFocused = useIsFocused();

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getProfileTopics(user);
		onUser(user.uid, getProfileTopics);
	}, [isFocused, user]);

	if (!loadingInitial && userTopics.length === 0)
		return (
			<>
				<SectionHeader
					title='Discover Topics'
					onPress={() => {
						if (loadingInitial) return;
						navigate(Routes.SEE_MORE_TOPICS, {
							title: 'Discover Topics',
							topics,
						});
					}}
				/>
				<TagRow data={topics} dataType='topic' />
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
				<TagRowSkeleton />
			) : (
				// TODO: Fix onPress
				<TagRow data={userTopics} dataType='topic' />
			)}
		</>
	);
};

export default YourTopics;
