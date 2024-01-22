import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { TNotificationTopic } from '../types';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { themeColors } from '../utils/constants';

type Props = {
	data: TNotificationTopic;
	containerProps?: TouchableHighlight['props'];
};

const TagComponent = ({ data, containerProps }: Props) => {
	const { notification = 0 } = data;
	return (
		<TouchableHighlight
			{...containerProps}
			onPress={() => {}} // TODO: Fix onPress
			className='w-fit px-5 py-1 bg-dark-secondaryBackground rounded-full'>
			<View className='flex-row items-center gap-2'>
				{notification > 0 && (
					<View className='absolute -left-5 -top-3'>
						<IonIcon
							name='notifications'
							size={16}
							color={themeColors.primaryColor[100]}
						/>
					</View>
				)}
				<Text className='text-dark-textColor text-base font-inter-regular'>
					{data.name}
				</Text>
				{/* {notification > 0 && (
					<Text className='text-primaryColor-100 text-sm font-inter-light'>
						{notification}
					</Text>
				)} */}
			</View>
		</TouchableHighlight>
	);
};

export default TagComponent;
