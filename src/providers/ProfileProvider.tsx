import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import {
	getProfiles,
	getFollowingProfiles,
} from '../database/services/MockProfileService';
import { TNotificationProfile, TProfile, TUser } from '../types';

const ProfileContext = React.createContext<{
	loadingInitial: boolean;
	profiles: TNotificationProfile[];
	getUserProfiles: (user: TUser) => Promise<TNotificationProfile[]>;
}>({
	loadingInitial: true,
	profiles: [],
	getUserProfiles: () => Promise.resolve([]),
});

type Props = {
	children: React.ReactNode;
};

export const ProfileProvider = ({ children }: Props) => {
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
	const [profiles, setProfiles] = useState<TNotificationProfile[]>([]);

	// User profiles
	const getUserProfiles = async (user: TUser) => {
		if (!user) return [];
		const _userProfiles = await getFollowingProfiles(user);
		setLoadingInitial(typeof _userProfiles === 'undefined');
		return _userProfiles ?? [];
	};

	// All profiles
	useEffect(() => {
		const getAllProfiles = async () => {
			const _allProfiles = await getProfiles();
			setProfiles(_allProfiles ?? []);
		};
		getAllProfiles();
	}, []);

	const profileProvProps = React.useMemo(
		() => ({
			loadingInitial,
			profiles,
			getUserProfiles,
		}),
		[loadingInitial, profiles, getUserProfiles]
	);

	return (
		<ProfileContext.Provider value={profileProvProps}>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfiles = () => {
	return React.useContext(ProfileContext);
};
