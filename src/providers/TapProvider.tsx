import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { TTap } from '../types';
import { getTaps } from '../database/services/MockTapService';
import { useAuth } from './AuthProvider';

const TapContext = React.createContext<{
	taps: TTap[];
	setTaps: React.Dispatch<React.SetStateAction<TTap[]>>;
}>({
	taps: [],
	setTaps: () => {},
});

type Props = {
	children: React.ReactNode;
};

export const TapProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const navigator =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [taps, setTaps] = useState<TTap[]>([]);

	useEffect(() => {
		const getAllTaps = async () => {
			const _allTaps = await getTaps();

			setTaps(_allTaps);
		};
		if (user) {
			getAllTaps();
		}
	}, [user]);

	const tapProvProps = React.useMemo(
		() => ({
			taps,
			setTaps,
		}),
		[taps, setTaps]
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
