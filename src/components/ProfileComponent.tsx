import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { TNotificationProfile, TProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';

type Props = {
	profile: TNotificationProfile | TProfile;
	containerProps?: View['props'];
	width?: number;
	showName?: boolean;
};

const ProfileComponent = ({
	profile,
	containerProps,
	width = 85,
	showName = true,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const notification = 'notification' in profile ? profile.notification : 0;
	return (
		<TouchableOpacity
			onPress={() =>
				navigate(Routes.PROFILE_SCREEN, {
					profile,
				})
			}
			className='items-center'
			{...containerProps}>
			<View
				style={{
					width,
				}}
				className={`aspect-square flex items-center justify-center border-2 rounded-full p-[3px] ${notification ? 'border-primaryColor-100' : 'border-dark-secondaryBackground'}`}>
				{notification > 0 && (
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
			{showName && (
				<Text
					style={{
						width,
					}}
					numberOfLines={1}
					className='text-dark-textColor text-xs font-inter-regular text-center mt-1'>
					{profile.name}
				</Text>
			)}
		</TouchableOpacity>
	);
};

export default ProfileComponent;
