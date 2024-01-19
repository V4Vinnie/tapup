import { FlatList, Text, View } from 'react-native';
import React from 'react';
import { TTap } from '../types';
import TapComponent from './TapComponent';

type Props = {
	tapData: TTap[];
	containerProps?: View['props'];
};

const TapRow = ({ tapData, containerProps }: Props) => {
	return (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={tapData}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					gap: 16,
				}}
				renderItem={({ item }) => <TapComponent data={item} />}
			/>
		</View>
	);
};

export default TapRow;
