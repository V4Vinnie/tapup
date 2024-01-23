import React, { useEffect, useMemo, useRef, useState } from 'react';
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

	// User profiles
	const userProfilesDone = useRef<boolean>(false);
	const getUserProfiles = (user: TUser) => {
		if (!user) return [];
		getFollowingProfiles(user).then((profiles) => {
			userProfilesDone.current = true;
			setUserProfiles(profiles ?? []);
		});
	};

	// All profiles
	const allProfilesDone = useRef<boolean>(false);
	useEffect(() => {
		const getAllProfiles = () => {
			getProfiles().then((profiles) => {
				allProfilesDone.current = true;
				setProfiles(profiles ?? []);
			});
		};
		getAllProfiles();
	}, []);

	const loadingInitial = useMemo(
		() => userProfilesDone.current && allProfilesDone.current,
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
