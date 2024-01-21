import { FlatList, View } from 'react-native';
import React from 'react';
import { TContinueWatchingTap, TTap } from '../types';
import TapComponent from './TapComponent';

type Props = {
	tapData: TTap[] | TContinueWatchingTap[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 16;
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
					<TapComponent
						data={item}
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
