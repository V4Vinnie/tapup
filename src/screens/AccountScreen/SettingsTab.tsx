import React from 'react';
import { Text, Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { themeColors } from '../../utils/constants';

type Props = {
	title: string;
	onPress: () => void;
	icon: React.ReactNode;
};

const SettingsTab = ({ title, onPress, icon }: Props) => {
	return (
		<Pressable
			className='flex flex-row justify-between items-center border-b-[1px] border-b-dark-textColor/50 pb-2 mb-4'
			onPress={onPress}>
			<View className='flex flex-row gap-3 items-center'>
				{icon}
				<Text className='text-dark-textColor text-lg font-inter-medium'>
					{title}
				</Text>
			</View>

			<Icon
				name='chevron-right'
				size={18}
				color={themeColors.dark.textColor}
			/>
		</Pressable>
	);
};

export default SettingsTab;
