import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { mode, themeColors } from '../utils/constants';

type Props = {
	title: string;
	onPress: () => void;
};

const SectionHeader = ({ title, onPress }: Props) => {
	return (
		<TouchableOpacity onPress={onPress} className='w-full'>
			<View className='w-full flex-row items-center justify-between py-4 mt-4'>
				<Text className='font-inter-bold text-xl text-dark-headerPrimaryColor'>
					{title}
				</Text>

				<AntIcon
					name='arrowright'
					size={20}
					color={themeColors[mode].headerPrimaryColor}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default SectionHeader;
