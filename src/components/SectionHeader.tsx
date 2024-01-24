import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { mode, themeColors } from '../utils/constants';

type Props = {
	title: string;
	onPress: () => void;
	icon?: ReactNode;
};

const SectionHeader = ({ title, onPress, icon }: Props) => {
	return (
		<TouchableOpacity onPress={onPress} className='w-full px-4'>
			<View className='w-full flex-row items-center justify-between pt-5 pb-3 mt-4'>
				<Text
					numberOfLines={1}
					className='font-inter-semiBold text-xl text-dark-headerPrimaryColor w-11/12'>
					{title}
				</Text>

				{icon ?? (
					<AntIcon
						name='arrowright'
						size={20}
						color={themeColors[mode].headerPrimaryColor}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
};

export default SectionHeader;
