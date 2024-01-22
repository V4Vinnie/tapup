import React, { useEffect, useState } from 'react';
import { TTap } from '../types';
import {
	getTaps,
	getTapsWithProgressForUser,
} from '../database/services/MockTapService';
import { useAuth } from './AuthProvider';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	getUserTaps: () => Promise<TTap[]>;
}>({
	loadingInitial: true,
	taps: [],
	getUserTaps: async () => [],
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
	const [taps, setTaps] = useState<TTap[]>([]);

	// User taps
	const getUserTaps = async () => {
		if (!user) return [];
		const _userTaps = await getTapsWithProgressForUser(user);
		setLoadingInitial(typeof _userTaps === 'undefined');
		return _userTaps ?? [];
	};

	// TODO: Discover taps
	useEffect(() => {
		const getAllTaps = async () => {
			const _allTaps = await getTaps();
			setTaps(_allTaps);
		};
		getAllTaps();
	}, []);

	const tapProvProps = React.useMemo(
		() => ({
			loadingInitial,
			taps,
			getUserTaps,
		}),
		[loadingInitial, taps, getUserTaps]
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
