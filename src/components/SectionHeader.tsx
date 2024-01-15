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
		<TouchableOpacity onPress={onPress}>
			<View className='w-11/12 flex-row items-center justify-between py-4 my-4'>
				<Text className='font-bold text-xl text-light-textColor dark:text-dark-textColor'>
					{title}
				</Text>

				<AntIcon
					name='arrowright'
					size={20}
					color={themeColors[mode].subTextColor}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default SectionHeader;
