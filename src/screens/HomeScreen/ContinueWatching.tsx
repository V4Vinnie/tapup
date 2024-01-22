import React, { useEffect } from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useTaps } from '../../providers/TapProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { TContinueWatchingTap } from '../../types';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import TapRow from '../../components/TapRow';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'react-native';

const ContinueWatching = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { getUserTaps, loadingInitial } = useTaps();
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [watchingTaps, setWatchingTaps] = React.useState<
		TContinueWatchingTap[]
	>([]);

	useEffect(() => {
		if (!user?.uid) return;
		const userTaps = () => {
			getUserTaps()
				.then((taps) => {
					setWatchingTaps(taps);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		if (isFocused) userTaps();
		onUser(user.uid, userTaps);
	}, [isFocused, user]);

	return (
		<>
			<SectionHeader
				title='Continue watching'
				onPress={() =>
					navigate(Routes.GENERAL_SEE_MORE, {
						title: 'Continue watching',
						data: watchingTaps,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : watchingTaps.length === 0 ? (
				<Text className='text-dark-textColor text-center h-10'>
					No taps to show
				</Text> // TODO: Figure out what to show when there are no continue watching taps
			) : (
				<TapRow tapData={watchingTaps} />
			)}
		</>
	);
};

export default ContinueWatching;
