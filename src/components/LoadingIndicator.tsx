import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { mode, themeColors } from '../utils/constants';

type Props = {};

const LoadingIndicator = (props: Props) => {
	return (
		<View className='flex-1 justify-center items-center'>
			<ActivityIndicator
				size='large'
				color={themeColors[mode].activeColor}
			/>
		</View>
	);
};

export default LoadingIndicator;
