import React, { useEffect, useMemo, useState } from 'react';
import {
	getProfiles,
	getFollowingProfiles,
} from '../database/services/ProfileService';
import { TNotificationProfile, TProfile } from '../types';

const ProfileContext = React.createContext<{
	loadingInitial: boolean;
	profiles: TNotificationProfile[];
	getProfileProfiles: (user: TProfile) => void;
	userProfiles: TNotificationProfile[];
}>({
	loadingInitial: true,
	profiles: [],
	getProfileProfiles: () => {},
	userProfiles: [],
});

type Props = {
	children: React.ReactNode;
};

export const ProfileProvider = ({ children }: Props) => {
	const [profiles, setProfiles] = useState<TNotificationProfile[]>([]);
	const [userProfiles, seTProfileProfiles] = useState<TNotificationProfile[]>(
		[]
	);
	const [userProfilesDone, seTProfileProfilesDone] = useState<boolean>(false);
	const [allProfilesDone, setAllProfilesDone] = useState<boolean>(false);

	// User profiles
	const getProfileProfiles = (user: TProfile) => {
		if (!user) return [];
		getFollowingProfiles(user).then((profiles) => {
			seTProfileProfiles(profiles ?? []);
			seTProfileProfilesDone(true);
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
			getProfileProfiles,
			userProfiles,
		}),
		[loadingInitial, profiles, getProfileProfiles, userProfiles]
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
