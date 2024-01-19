import { FlatList, Text, View } from 'react-native';
import React from 'react';
import { TTap } from '../types';

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
				renderItem={({ item }) => (
					<Text className='text-white'>{item.name}</Text>
				)}
			/>
		</View>
	);
};

export default TapRow;
