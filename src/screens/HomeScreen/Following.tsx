import React, { useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { TNotificationProfile, TUser } from '../../types';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useProfiles } from '../../providers/ProfileProvider';
import ProfileRow from '../../components/ProfileRow';

const Following = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getUserProfiles, profiles, loadingInitial } = useProfiles();
	const isFocused = useIsFocused();
	const [followingProfiles, setFollowingProfiles] = React.useState<
		TNotificationProfile[]
	>([]);

	useEffect(() => {
		if (!user?.uid) return;
		const userProfiles = (user: TUser) => {
			getUserProfiles(user)
				.then((profiles) => {
					const sortedProfiles = [...profiles].sort(
						(a, b) => b.notification - a.notification
					);
					setFollowingProfiles(sortedProfiles);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		if (isFocused) userProfiles(user);
		onUser(user.uid, userProfiles);
	}, [isFocused, user?.userSubscriptionIds]);

	if (followingProfiles.length === 0)
		return (
			<>
				<SectionHeader
					title='Discover Profiles'
					onPress={() =>
						navigate(Routes.SEE_MORE_PROFILES, {
							title: 'Discover Profiles',
							profiles,
						})
					}
				/>
				<ProfileRow profiles={profiles} />
			</>
		);
	return (
		<>
			<SectionHeader
				title='Following'
				onPress={() =>
					navigate(Routes.SEE_MORE_PROFILES, {
						title: 'Following',
						profiles: followingProfiles,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : (
				// TODO: Fix onPress
				<ProfileRow profiles={followingProfiles} />
			)}
		</>
	);
};

export default Following;
