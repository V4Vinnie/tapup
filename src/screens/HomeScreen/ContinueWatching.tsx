import React, { useEffect } from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useTaps } from '../../providers/TapProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import TapRow from '../../components/TapRow';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TContinueWatchingTap, TProfile, TTap } from '../../types';
import { getBusyWatchingTaps } from '../../database/services/TapService';

const ContinueWatching = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { loadingInitial, taps } = useTaps();
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [continueWatching, setContinueWatching] = React.useState<TTap[]>([]);

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getContinueWatching(user);
		const sub = onUser(user.uid, getContinueWatching);
		return () => (sub ? sub() : undefined);
	}, [isFocused, user]);

	const getContinueWatching = (user: TProfile) => {
		const busyWatching = getBusyWatchingTaps(user, taps);
		setContinueWatching(busyWatching);
	};

	if (!loadingInitial && continueWatching.length === 0) {
		return false;
	}

	return (
		<>
			<SectionHeader
				title='Continue watching'
				onPress={() => {
					if (loadingInitial) return;
					navigate(Routes.SEE_MORE_TAPS, {
						title: 'Continue watching',
						taps: continueWatching,
					});
				}}
			/>
			<TapRow tapData={continueWatching} loading={loadingInitial} />
		</>
	);
};

export default ContinueWatching;
