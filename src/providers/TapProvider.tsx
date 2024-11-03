import React, { useEffect, useMemo, useState } from 'react';
import { TContinueWatchingTap, TTap, TProfile } from '../types';
import {
	getAllTaps,
	getProcessPercentageForTaps,
	getUnwatchedTaps,
} from '../database/services/TapService';
import { useAuth } from './AuthProvider';
import { useCompany } from './CompanyProvider';

const tapInitial = {
	loadingInitial: true,
	taps: [],
	discoverTaps: [],
	tapProgressPercentages: {},
	getProgressForTap: () => 0,
	resetState: () => {},
};

const TapContext = React.createContext<{
	loadingInitial: boolean;
	taps: TTap[];
	discoverTaps: TTap[];
	tapProgressPercentages: Record<string, number>;
	getProgressForTap: (tapId: string) => number;
	resetState: () => void;
}>(tapInitial);

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const { company } = useCompany();
	const [taps, setTaps] = useState<TTap[]>(tapInitial.taps);
	const [tapProgressPercentages, setTapProgressPercentages] = useState<
		Record<string, number>
	>(tapInitial.tapProgressPercentages);
	const [discoverTaps, setDiscoverTaps] = useState<TTap[]>(
		tapInitial.discoverTaps
	);

	// User Taps
	const getProgressForTap = (tapId: string) => {
		if (!user?.uid) return 0;
		if (!tapProgressPercentages[tapId]) return 0;
		return tapProgressPercentages[tapId];
	};

	const resetState = () => {
		setTaps(tapInitial.taps);
		setTapProgressPercentages(tapInitial.tapProgressPercentages);
		setDiscoverTaps(tapInitial.discoverTaps);
	};

	// All Taps
	useEffect(() => {
		const getAll = () => {
			if (!user?.uid) return;
			if (!company) return;
			try {
				getAllTaps(company).then((taps) => {
					setTaps(taps ?? []);
					const unwatchedTaps = getUnwatchedTaps(user, taps);
					setDiscoverTaps(unwatchedTaps ?? []);
					const percentages = getProcessPercentageForTaps(user, taps);
					setTapProgressPercentages(percentages ?? {});
				});
			} catch (error) {
				console.log('getAll in TapProvider ', error);
			}
		};
		getAll();
	}, [company, user]);

	const loadingInitial = false;

	const tapProvProps = React.useMemo(
		() => ({
			loadingInitial,
			taps,
			discoverTaps,
			tapProgressPercentages,
			getProgressForTap,
			resetState,
		}),
		[
			loadingInitial,
			taps,
			discoverTaps,
			tapProgressPercentages,
			getProgressForTap,
			resetState,
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
