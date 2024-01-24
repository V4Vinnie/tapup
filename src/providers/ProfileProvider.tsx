import React, { useEffect, useMemo, useState } from 'react';
import {
	getProfiles,
	getFollowingProfiles,
} from '../database/services/MockProfileService';
import { TNotificationProfile, TUser } from '../types';

const ProfileContext = React.createContext<{
	loadingInitial: boolean;
	profiles: TNotificationProfile[];
	getUserProfiles: (user: TUser) => void;
	userProfiles: TNotificationProfile[];
}>({
	loadingInitial: true,
	profiles: [],
	getUserProfiles: () => {},
	userProfiles: [],
});

type Props = {
	children: React.ReactNode;
};

export const ProfileProvider = ({ children }: Props) => {
	const [profiles, setProfiles] = useState<TNotificationProfile[]>([]);
	const [userProfiles, setUserProfiles] = useState<TNotificationProfile[]>(
		[]
	);
	const [userProfilesDone, setUserProfilesDone] = useState<boolean>(false);
	const [allProfilesDone, setAllProfilesDone] = useState<boolean>(false);

	// User profiles
	const getUserProfiles = (user: TUser) => {
		if (!user) return [];
		getFollowingProfiles(user).then((profiles) => {
			setUserProfiles(profiles ?? []);
			setUserProfilesDone(true);
		});
	};

	// All profiles
	useEffect(() => {
		const getAllProfiles = () => {
			getProfiles().then((profiles) => {
				setProfiles(profiles ?? []);
				setAllProfilesDone(true);
			});
		};
		getAllProfiles();
	}, []);

	const loadingInitial = useMemo(
		() => !(userProfilesDone && allProfilesDone),
		[userProfilesDone, allProfilesDone]
	);

	const profileProvProps = React.useMemo(
		() => ({
			loadingInitial,
			profiles,
			getUserProfiles,
			userProfiles,
		}),
		[loadingInitial, profiles, getUserProfiles, userProfiles]
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
