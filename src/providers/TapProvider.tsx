import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TContinueWatchingTap, TTap, TUser } from '../types';
import {
	getAllTaps,
	getTapsWithProgressForUser,
	getUserDiscoverTaps,
} from '../database/services/MockTapService';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	discoverTaps: TTap[];
	userTaps: TContinueWatchingTap[];
	getDiscoverTaps: (user: TUser) => void;
	getUserTaps: (user: TUser) => void;
}>({
	loadingInitial: true,
	taps: [],
	discoverTaps: [],
	userTaps: [],
	getDiscoverTaps: () => {},
	getUserTaps: () => {},
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
	const getUserTaps = (user: TUser) => {
		if (!user?.uid) return [];
		getTapsWithProgressForUser(user).then((taps) => {
			setUserTaps(taps ?? []);
			setUserTapsDone(true);
		});
	};

	// Discover Taps
	const getDiscoverTaps = (user: TUser) => {
		if (!user?.uid) return [];
		getUserDiscoverTaps(user).then((taps) => {
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
			getUserTaps,
		}),
		[
			loadingInitial,
			taps,
			discoverTaps,
			userTaps,
			getDiscoverTaps,
			getUserTaps,
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
