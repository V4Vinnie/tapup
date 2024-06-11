import { FlatList, Image, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { TContinueWatchingTap, TTap } from '../types';
import PreviewComponent from './PreviewComponent';

type Props = {
	tapData: TTap[] | TContinueWatchingTap[];
	containerProps?: View['props'];
	loading?: boolean;
};

const SPACE_BETWEEN = 10;
const TapRow = ({ tapData, containerProps, loading }: Props) => {
	const [imagesLoading, setImagesLoading] = React.useState<boolean>(true);

	useEffect(() => {
		const imageUrls = tapData.map((tap) => Image.prefetch(tap.thumbnail));
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [tapData]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loading;
	}, [imagesLoading, loading]);

	return dataLoading ? (
		<TapRowSkeleton />
	) : (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={tapData}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
					columnGap: SPACE_BETWEEN,
				}}
				renderItem={({ item, index }) => (
					<PreviewComponent
						key={item.id}
						fullTap={item}
						thumbnail={item.thumbnail}
						text={item.name}
						progress={
							'progress' in item
								? (item as TContinueWatchingTap).progress
								: undefined
						}
					/>
				)}
			/>
		</View>
	);
};

const TapRowSkeleton = () => {
	return (
		<View className='w-full'>
			<FlatList
				horizontal
				data={[1, 2, 3, 4, 5]}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.toString() + 'tap'}
				contentContainerStyle={{
					paddingHorizontal: 16,
					columnGap: SPACE_BETWEEN,
				}}
				renderItem={({ item, index }) => (
					<PreviewComponent key={item} loading />
				)}
			/>
		</View>
	);
};

export default TapRow;
