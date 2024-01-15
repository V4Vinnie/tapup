import React from 'react';
import { Text, View } from 'react-native';

type Props = {};

const HomeScreen = (props: Props) => {
	return (
		<View className='flex-1 justify-center items-center bg-dark-primaryBackground'>
			<Text className='text-dark-textColor'>HomeScreen</Text>
		</View>
	);
};

export default HomeScreen;
