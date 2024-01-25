import React, { useEffect, useMemo } from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useTaps } from '../../providers/TapProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { onUser } from '../../database/services/UserService';
import SectionHeader from '../../components/SectionHeader';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Text, View } from 'react-native';
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
	const [imagesLoading, setImagesLoading] = React.useState<boolean>(true);

	useEffect(() => {
		if (!user?.uid) return;
		if (isFocused) getDiscoverTaps(user);
		onUser(user.uid, getDiscoverTaps);
	}, [isFocused, user]);

	useEffect(() => {
		if (!discoverTaps) return;
		setNewTaps(discoverTaps);
	}, [discoverTaps]);

	useEffect(() => {
		const imageUrls = newTaps.map((tap) => Image.prefetch(tap.thumbnail));
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [newTaps]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loadingInitial;
	}, [imagesLoading, loadingInitial]);

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
			{dataLoading ? (
				<NewTapsSkeleton />
			) : newTaps.length === 0 ? (
				<Text className='text-dark-textColor text-center h-10'>
					No new taps
				</Text> // TODO: Figure out what to show when there are no continue watching taps
			) : (
				<View className='px-4 mb-4'>
					{/* Show only first 10 */}
					{newTaps.slice(0, 10).map((tap, index) => (
						<View className='mb-4' key={tap.id}>
							<FullInfoTap tap={tap} isNew={true} />
						</View>
					))}
				</View>
			)}
		</>
	);
};

const NewTapsSkeleton = () => {
	return (
		<View className='px-4 mb-4'>
			{/* Show only first 10 */}
			{[1, 2, 3, 4, 5].map((item) => (
				<FullInfoTap key={item} loading />
			))}
		</View>
	);
};

export default NewTaps;
