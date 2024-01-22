import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { TNotificationTopic } from '../types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { themeColors } from '../utils/constants';

type Props = {
	data: TNotificationTopic;
	containerProps?: TouchableHighlight['props'];
	arrow?: boolean;
	notificationAmount?: number;
};

const TagComponent = ({ data, containerProps, arrow = true }: Props) => {
	const { notificationCount = 0 } = data;
	return (
		<TouchableHighlight
			{...containerProps}
			onPress={() => {}} // TODO: Fix onPress
			className={`w-fit px-6 py-1 bg-dark-secondaryBackground rounded-full ${arrow ? 'pl-7 pr-3' : 'px-8'}`}>
			<View className='flex-row items-center gap-2'>
				{notificationCount > 0 && (
					<View
						className={`absolute -left-6 -top-5 w-6 h-6 rounded-full bg-primaryColor-100 flex items-center justify-normal`}>
						<Text className='text-[10px] font-inter-medium text-dark-primaryBackground text-center mt-[5px]'>
							{notificationCount > 99 ? '99+' : notificationCount}
						</Text>
					</View>
				)}
				<Text className='text-dark-textColor text-md font-inter-regular'>
					{data.name}
				</Text>
				{arrow && (
					<AntIcon
						name='arrowright'
						size={24}
						color={themeColors.primaryColor[100]}
					/>
				)}
			</View>
		</TouchableHighlight>
	);
};

export default TagComponent;
