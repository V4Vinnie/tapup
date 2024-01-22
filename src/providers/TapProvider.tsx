import React, { useEffect, useState } from 'react';
import { TTap } from '../types';
import {
	getAllTaps,
	getTapsWithProgressForUser,
	getUserDiscoverTaps,
} from '../database/services/MockTapService';
import { useAuth } from './AuthProvider';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	getDiscoverTaps: () => Promise<TTap[]>;
	getUserTaps: () => Promise<TTap[]>;
}>({
	loadingInitial: true,
	taps: [],
	getDiscoverTaps: async () => [],
	getUserTaps: async () => [],
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
	const [taps, setTaps] = useState<TTap[]>([]);

	// User Taps
	const getUserTaps = async () => {
		if (!user?.uid) return [];
		const _userTaps = await getTapsWithProgressForUser(user);
		setLoadingInitial(typeof _userTaps === 'undefined');
		return _userTaps ?? [];
	};

	const getDiscoverTaps = async () => {
		if (!user?.uid) return [];
		const _allTaps = await getUserDiscoverTaps(user);
		setLoadingInitial(typeof _allTaps === 'undefined');
		return _allTaps ?? [];
	};

	useEffect(() => {
		const getAll = async () => {
			const _allTaps = await getAllTaps();
			setTaps(_allTaps ?? []);
		};
		getAll();
	}, []);

	const tapProvProps = React.useMemo(
		() => ({
			loadingInitial,
			taps,
			getDiscoverTaps,
			getUserTaps,
		}),
		[loadingInitial, taps, getDiscoverTaps, getUserTaps]
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
