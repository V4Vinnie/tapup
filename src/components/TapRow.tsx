import { FlatList, View } from 'react-native';
import React from 'react';
import { TContinueWatchingTap, TTap } from '../types';
import PreviewComponent from './PreviewComponent';

type Props = {
	tapData: TTap[] | TContinueWatchingTap[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 10;
const TapRow = ({ tapData, containerProps }: Props) => {
	return (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={tapData}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
				}}
				renderItem={({ item, index }) => (
					<PreviewComponent
						thumbnail={item.thumbnail}
						text={item.name}
						progress={
							'progress' in item
								? (item as TContinueWatchingTap).progress
								: undefined
						}
						containerProps={{
							style: {
								marginRight:
									index === tapData.length - 1
										? 0
										: SPACE_BETWEEN,
							},
						}}
					/>
				)}
			/>
		</View>
	);
};

export default TapRow;
