import React, { useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useAuth } from '../../providers/AuthProvider';
import { TNotificationProfile } from '../../types';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useProfiles } from '../../providers/ProfileProvider';
import ProfileRow from '../../components/ProfileRow';

const Following = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const { getUserProfiles, loadingInitial } = useProfiles();
	const isFocused = useIsFocused();
	const [followingProfiles, setFollowingProfiles] = React.useState<
		TNotificationProfile[]
	>([]);

	useEffect(() => {
		if (!user?.uid) return;
		const userProfiles = () => {
			getUserProfiles()
				.then((profiles) => {
					setFollowingProfiles(profiles);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		if (isFocused) userProfiles();
		onUser(user.uid, userProfiles);
	}, [isFocused, user]);

	return (
		<>
			<SectionHeader
				title='Following'
				onPress={() =>
					navigate(Routes.GENERAL_SEE_MORE, {
						title: 'Following',
						data: followingProfiles,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : // TODO: Fix onPress
			followingProfiles.length === 0 ? null : (
				<ProfileRow profiles={followingProfiles} />
			)}
		</>
	);
};

export default Following;
