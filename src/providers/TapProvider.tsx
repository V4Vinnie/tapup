import React, { useEffect, useMemo, useState } from 'react';
import { TContinueWatchingTap, TTap, TProfile } from '../types';
import {
	getAllTaps,
	getTapsWithProgressForUser,
	getProfileDiscoverTaps,
} from '../database/services/TapService';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	discoverTaps: TTap[];
	userTaps: TContinueWatchingTap[];
	getDiscoverTaps: (user: TProfile) => void;
	getProfileTaps: (user: TProfile) => void;
}>({
	loadingInitial: true,
	taps: [],
	discoverTaps: [],
	userTaps: [],
	getDiscoverTaps: () => {},
	getProfileTaps: () => {},
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const [taps, setTaps] = useState<TTap[]>([]);
	const [userTaps, setUserTaps] = useState<TContinueWatchingTap[]>([]);
	const [discoverTaps, setDiscoverTaps] = useState<TTap[]>([]);
	const [userTapsDone, setUserTapsDone] = useState<boolean>(false);
	const [discoverTapsDone, setDiscoverTapsDone] = useState<boolean>(false);
	const [allTapsDone, setAllTapsDone] = useState<boolean>(false);

	// User Taps
	const getProfileTaps = (user: TProfile) => {
		if (!user?.uid) return [];
		getTapsWithProgressForUser(user).then((taps) => {
			setUserTaps(taps ?? []);
			setUserTapsDone(true);
		});
	};

	// Discover Taps
	const getDiscoverTaps = (user: TProfile) => {
		if (!user?.uid) return [];
		getProfileDiscoverTaps(user).then((taps) => {
			setDiscoverTaps(taps ?? []);
			setDiscoverTapsDone(true);
		});
	};

	// All Taps
	useEffect(() => {
		const getAll = () => {
			getAllTaps().then((taps) => {
				setTaps(taps ?? []);
				setAllTapsDone(true);
			});
		};
		getAll();
	}, []);

	const loadingInitial = useMemo(() => {
		return !(userTapsDone && discoverTapsDone && allTapsDone);
	}, [userTapsDone, discoverTapsDone, allTapsDone]);

	const tapProvProps = React.useMemo(
		() => ({
			loadingInitial,
			taps,
			discoverTaps,
			userTaps,
			getDiscoverTaps,
			getProfileTaps,
		}),
		[
			loadingInitial,
			taps,
			discoverTaps,
			userTaps,
			getDiscoverTaps,
			getProfileTaps,
		]
	);

	return (
		<TapContext.Provider value={tapProvProps}>
			{children}
		</TapContext.Provider>
	);
};

export const useTaps = () => {
	return React.useContext(TapContext);
};
