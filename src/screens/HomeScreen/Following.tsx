import React, { useEffect, useMemo } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import { useProfiles } from '../../providers/ProfileProvider';
import { TNotificationProfile, TProfile } from '../../types';
import { Image } from 'react-native';
import ProfileRow from '../../components/ProfileRow';

const Following = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getUserProfiles, userProfiles, profiles, loadingInitial } =
		useProfiles();
	const isFocused = useIsFocused();
	const [following, setFollowing] = React.useState<TNotificationProfile[]>(
		[]
	);

	const sortProfilesByNotifications = (profiles: TNotificationProfile[]) => {
		return profiles.sort((a, b) => b.notification - a.notification);
	};

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getUserProfiles(user);
		onUser(user.uid, getUserProfiles);
	}, [isFocused, user]);

	useEffect(() => {
		if (!userProfiles) return;
		setFollowing(sortProfilesByNotifications(userProfiles));
	}, [userProfiles]);

	const sortedProfiles = useMemo(() => {
		return sortProfilesByNotifications(profiles);
	}, [profiles]);

	if (!loadingInitial && following.length === 0)
		return (
			<>
				<SectionHeader
					title='Discover Profiles'
					onPress={() => {
						if (loadingInitial) return;
						navigate(Routes.SEE_MORE_PROFILES, {
							title: 'Discover Profiles',
							profiles,
						});
					}}
				/>
				<ProfileRow profiles={sortedProfiles} />
			</>
		);
	return (
		<>
			<SectionHeader
				title='Following'
				onPress={() =>
					navigate(Routes.SEE_MORE_PROFILES, {
						title: 'Following',
						profiles: following,
					})
				}
			/>
			{/* TODO: Fix onPress */}
			<ProfileRow profiles={following} loading={loadingInitial} />
		</>
	);
};

export default Following;
