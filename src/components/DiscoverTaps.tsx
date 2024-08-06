import React, { useEffect, useMemo } from 'react';
import { useTaps } from '../providers/TapProvider';
import { useNavigation } from '@react-navigation/native';
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
	const { discoverTaps, loadingInitial } = useTaps();
	const [imagesLoading, setImagesLoading] = React.useState<boolean>(true);

	useEffect(() => {
		console.log(discoverTaps);

		const imageUrls = discoverTaps.map((tap) =>
			Image.prefetch(tap.thumbnail)
		);
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [discoverTaps]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loadingInitial;
	}, [imagesLoading, loadingInitial]);

	const hasOnPress = useMemo(() => {
		const func = () => {
			if (loadingInitial) return;
			navigate(Routes.SEE_MORE_TAPS, {
				title: 'New taps',
				taps: discoverTaps,
			});
		};
		if (rightButton) {
			return onPress ?? func;
		}
	}, [rightButton, onPress, loadingInitial]);

	return (
		<>
			<SectionHeader
				title={title ?? 'Taps to view'}
				onPress={hasOnPress}
			/>
			{dataLoading ? (
				<DiscoverTapsSkeleton />
			) : discoverTaps.length === 0 ? (
				<Text className='text-dark-textColor text-center h-10'>
					No new taps
				</Text> // TODO: Figure out what to show when there are no continue watching taps
			) : (
				<View className='px-4 mb-4'>
					{/* Show only first 10 */}
					{discoverTaps.slice(0, 10).map((tap, index) => (
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
