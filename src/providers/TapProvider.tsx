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

	// User Taps
	const userTapsDone = useRef<boolean>(false);
	const getUserTaps = (user: TUser) => {
		if (!user?.uid) return [];
		getTapsWithProgressForUser(user).then((taps) => {
			setUserTaps(taps ?? []);
			userTapsDone.current = true;
		});
	};

	// Discover Taps
	const discoverTapsDone = useRef<boolean>(false);
	const getDiscoverTaps = (user: TUser) => {
		if (!user?.uid) return [];
		getUserDiscoverTaps(user).then((taps) => {
			setDiscoverTaps(taps ?? []);
			discoverTapsDone.current = true;
		});
	};

	// All Taps
	const allTapsDone = useRef<boolean>(false);
	useEffect(() => {
		const getAll = () => {
			getAllTaps().then((taps) => {
				allTapsDone.current = true;
				setTaps(taps ?? []);
			});
		};
		getAll();
	}, []);

	const loadingInitial = useMemo(() => {
		return (
			userTapsDone.current &&
			discoverTapsDone.current &&
			allTapsDone.current
		);
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
