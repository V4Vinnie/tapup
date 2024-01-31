import React, { useEffect, useMemo } from 'react';
import { useTaps } from '../providers/TapProvider';
import { useAuth } from '../providers/AuthProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { onUser } from '../database/services/UserService';
import SectionHeader from './SectionHeader';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Text, View } from 'react-native';
import FullInfoTap from './FullInfoTap';
import { TTap } from '../types';

type Props = {
	title?: string;
	onPress?: () => void;
	rightButton?: boolean;
};

const DiscoverTaps = ({ title, onPress, rightButton = true }: Props) => {
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

	const hasOnPress = useMemo(() => {
		const func = () => {
			if (loadingInitial) return;
			navigate(Routes.SEE_MORE_TAPS, {
				title: 'New Taps',
				taps: newTaps,
			});
		};
		if (rightButton) {
			return onPress ?? func;
		}
	}, [rightButton, onPress, loadingInitial]);

	return (
		<>
			<SectionHeader title={title ?? 'New Taps'} onPress={hasOnPress} />
			{dataLoading ? (
				<DiscoverTapsSkeleton />
			) : newTaps.length === 0 ? (
				<Text className='text-dark-textColor text-center h-10'>
					No new taps
				</Text> // TODO: Figure out what to show when there are no continue watching taps
			) : (
				<View className='px-4 mb-4'>
					{/* Show only first 10 */}
					{newTaps.slice(0, 10).map((tap, index) => (
						<View className='mb-4' key={tap.name + index}>
							<FullInfoTap tap={tap} isNew={true} />
						</View>
					))}
				</View>
			)}
		</>
	);
};

const DiscoverTapsSkeleton = () => {
	return (
		<View className='px-4 mb-4'>
			{/* Show only first 10 */}
			{[1, 2, 3, 4, 5].map((item, index) => (
				<FullInfoTap key={item.toString() + index} loading />
			))}
		</View>
	);
};

export default DiscoverTaps;
