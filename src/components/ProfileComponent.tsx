import { View, Text, Image } from 'react-native';
import React from 'react';
import { TNotificationProfile } from '../types';

type Props = {
	profile: TNotificationProfile;
	containerProps?: View['props'];
	width?: number;
};

const ProfileComponent = ({ profile, containerProps, width = 85 }: Props) => {
	return (
		<View className='items-center' {...containerProps}>
			<View
				style={{
					width,
				}}
				className={`aspect-square flex items-center justify-center border-2 rounded-full p-[3px] ${profile.notification ? 'border-primaryColor-100' : 'border-dark-secondaryBackground'}`}>
				{profile.notification && (
					<View className='absolute w-4 h-4 rounded-full bg-primary top-0 right-0' />
				)}
				{profile.profilePic !== '' ? (
					<Image
						source={{ uri: profile.profilePic }}
						className='rounded-full w-full h-full'
					/>
				) : (
					<View className='rounded-full w-full h-full bg-dark-secondaryBackground flex items-center justify-center'>
						<Text className='text-dark-textColor text-4xl font-inter-bold text-center pt-1'>
							{profile.name.split(' ').map((n) => n[0])}
						</Text>
					</View>
				)}
			</View>
			<Text
				style={{
					width,
				}}
				numberOfLines={1}
				className='text-dark-textColor text-xs font-inter-regular text-center mt-1'>
				{profile.name}
			</Text>
		</View>
	);
};

export default ProfileComponent;
