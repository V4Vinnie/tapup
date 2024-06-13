import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { TNotificationTopic, TTap, TTopic } from '../types';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { mode, themeColors } from '../utils/constants';
import { Skeleton } from '@rneui/themed';
import { useCompany } from '../providers/CompanyProvider';

type Props = {
	data: TNotificationTopic | TTopic | TTap;
	containerProps?: TouchableHighlight['props'];
	onPress?: () => void;
};

const TagComponent = ({ data, containerProps, onPress }: Props) => {
	const { companyColor } = useCompany();
	const notification = 'notification' in data ? data.notification : 0;
	return (
		<TouchableHighlight
			{...containerProps}
			onPress={onPress} // TODO: Fix onPress
			className='w-fit px-5 py-1 bg-dark-secondaryBackground rounded-full'>
			<View className='flex-row items-center gap-2'>
				{notification > 0 && (
					<View className='absolute -left-5 -top-3'>
						<IonIcon
							name='notifications'
							size={16}
							color={companyColor}
						/>
					</View>
				)}
				<Text className='text-dark-textColor text-base font-inter-regular'>
					{data.name}
				</Text>
			</View>
		</TouchableHighlight>
	);
};

export const TagComponentSkeleton = () => {
	return (
		<Skeleton
			width={Math.floor(Math.random() * 60) + 80}
			height={30}
			animation='wave'
			style={{
				borderRadius: 100,
				backgroundColor: themeColors[mode].secondaryBackground,
			}}
			skeletonStyle={{
				backgroundColor: themeColors[mode].subTextColor,
				opacity: 0.05,
			}}
		/>
	);
};

export default TagComponent;
