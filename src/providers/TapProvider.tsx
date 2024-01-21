import React, { useEffect, useState } from 'react';
import { TTap } from '../types';
import { getTaps, getTapsForUser } from '../database/services/MockTapService';
import { useAuth } from './AuthProvider';

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	userTaps: TTap[];
}>({
	loadingInitial: true,
	taps: [],
	userTaps: [],
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
	const [taps, setTaps] = useState<TTap[]>([]);
	const [userTaps, setUserTaps] = useState<TTap[]>([]);

	// User taps
	useEffect(() => {
		const getUserTaps = async () => {
			const _userTaps = await getTapsForUser(user!);
			setUserTaps((_) => {
				setLoadingInitial(false);
				return _userTaps ?? [];
			});
		};
		if (user) {
			getUserTaps();
		}
	}, [user]);

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
			userTaps,
			setUserTaps,
		}),
		[loadingInitial, taps, userTaps]
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
