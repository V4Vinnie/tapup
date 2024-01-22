import React, { useEffect, useState } from 'react';
import { TTap } from '../types';
import {
	getTapsWithProgressForUser,
	getUserDiscoverTaps,
} from '../database/services/MockTapService';
import { useAuth } from './AuthProvider';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	getDiscoverTaps: () => Promise<TTap[]>;
	getUserTaps: () => Promise<TTap[]>;
}>({
	loadingInitial: true,
	getDiscoverTaps: async () => [],
	getUserTaps: async () => [],
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

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

	const tapProvProps = React.useMemo(
		() => ({
			loadingInitial,
			getDiscoverTaps,
			getUserTaps,
		}),
		[loadingInitial, getDiscoverTaps, getUserTaps]
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
