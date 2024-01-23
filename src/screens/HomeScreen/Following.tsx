import React, { useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useProfiles } from '../../providers/ProfileProvider';
import ProfileRow from '../../components/ProfileRow';
import { TNotificationProfile } from '../../types';

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

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getUserProfiles(user);
		onUser(user.uid, getUserProfiles);
	}, [isFocused, user]);

	useEffect(() => {
		if (!userProfiles) return;
		setFollowing(userProfiles);
	}, [userProfiles]);

	if (following.length === 0)
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
						profiles: following,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : (
				// TODO: Fix onPress
				<ProfileRow profiles={following} />
			)}
		</>
	);
};

export default Following;
