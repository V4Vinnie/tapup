import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { TNotificationTopic } from '../types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { themeColors } from '../utils/constants';

type Props = {
	data: TNotificationTopic;
	containerProps?: TouchableHighlight['props'];
	arrow?: boolean;
};

const TagComponent = ({ data, containerProps, arrow = true }: Props) => {
	const { notification = false } = data;
	return (
		<TouchableHighlight
			{...containerProps}
			onPress={() => {}} // TODO: Fix onPress
			className={`w-fit px-6 py-1 bg-dark-secondaryBackground rounded-full ${arrow ? 'pl-5 pr-3' : 'px-4'}`}>
			<View className='flex-row items-center gap-2'>
				{notification && (
					<View
						className={`absolute -left-4 -top-2 w-3 aspect-square rounded-full bg-primaryColor-100 flex items-center justify-normal`}
					/>
				)}
				<Text className='text-dark-textColor text-base font-inter-regular'>
					{data.name}
				</Text>
				{arrow && (
					<AntIcon
						name='arrowright'
						size={16}
						color={themeColors.primaryColor[100]}
					/>
				)}
			</View>
		</TouchableHighlight>
	);
};

export default TagComponent;
