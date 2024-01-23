import React, { useEffect } from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useTaps } from '../../providers/TapProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import FullInfoTap from '../../components/FullInfoTap';
import { TTap } from '../../types';

const SPACE_BETWEEN = 16;
const NewTaps = () => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { getDiscoverTaps, discoverTaps, loadingInitial } = useTaps();
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [newTaps, setNewTaps] = React.useState<TTap[]>([]);

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getDiscoverTaps(user);
		onUser(user.uid, getDiscoverTaps);
	}, [isFocused, user]);

	useEffect(() => {
		if (!discoverTaps) return;
		setNewTaps(discoverTaps);
	}, [discoverTaps]);

	return (
		<>
			<SectionHeader
				title='New Taps'
				onPress={() =>
					navigate(Routes.SEE_MORE_TAPS, {
						title: 'New Taps',
						taps: newTaps,
					})
				}
			/>
			{loadingInitial ? (
				<LoadingIndicator /> // TODO: Add Skeleton Loading
			) : newTaps.length === 0 ? (
				<Text className='text-dark-textColor text-center h-10'>
					No new taps
				</Text> // TODO: Figure out what to show when there are no continue watching taps
			) : (
				<View className='px-4 mb-4'>
					{/* Show only first 10 */}
					{newTaps.slice(0, 10).map((tap, index) => (
						<FullInfoTap
							key={tap.id}
							tap={tap}
							isNew={true}
							containerProps={{
								style: {
									marginBottom:
										index === newTaps.length - 1
											? 0
											: SPACE_BETWEEN,
								},
							}}
						/>
					))}
				</View>
			)}
		</>
	);
};

export default NewTaps;
