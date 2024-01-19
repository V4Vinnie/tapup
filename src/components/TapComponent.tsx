import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TTap } from '../types';
import { mode, themeColors } from '../utils/constants';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
	data: TTap;
};

const TapComponent = ({ data }: Props) => {
	return (
		<View className='w-32 h-44 rounded-lg overflow-hidden'>
			<Image source={{ uri: data.thumbnail }} className='w-full h-full' />
			<LinearGradient
				className='absolute bottom-0 w-full h-1/2'
				colors={['transparent', 'rgba(0,0,0,0.8)']}
			/>
			<View className='absolute bottom-0 w-full h-12 px-2 flex flex-row justify-between items-center'>
				<Text className='text-white text-left text-xs font-inter-medium'>
					{data.name}
				</Text>
				<AntIcon
					name='arrowright'
					size={20}
					color={themeColors.primaryColor[100]}
				/>
			</View>
		</View>
	);
};

export default TapComponent;
