import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import SectionHeader from '../../components/SectionHeader';
import ProfileRow from '../../components/ProfileRow';
import { useProfiles } from '../../providers/ProfileProvider';
import { TNotificationProfile } from '../../types';

const DiscoverProfiles = () => {
	const { profiles, loadingInitial } = useProfiles();
	const sortProfilesByNotifications = (profiles: TNotificationProfile[]) => {
		return profiles.sort((a, b) => b.notification - a.notification);
	};

	const sortedProfiles = useMemo(() => {
		return sortProfilesByNotifications(profiles);
	}, [profiles]);

	return (
		<View className='w-full'>
			<SectionHeader title='Profiles' />
			<ProfileRow profiles={sortedProfiles} loading={loadingInitial} />
		</View>
	);
};

export default DiscoverProfiles;
