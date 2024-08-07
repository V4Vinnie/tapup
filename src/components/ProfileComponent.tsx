import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { TNotificationProfile, TProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { Skeleton } from '@rneui/themed';
import { mode, themeColors } from '../utils/constants';
import { useCompany } from '../providers/CompanyProvider';

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
	const { companyColor } = useCompany();

	const notification = 'notification' in profile ? profile.notification : 0;
	return (
		<Pressable
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
					borderColor: notification
						? companyColor
						: themeColors[mode].secondaryBackground,
				}}
				className={`aspect-square flex items-center justify-center border-2 rounded-full p-[3px]`}>
				{notification > 0 && (
					<View className='absolute w-4 h-4 rounded-full bg-primary top-0 right-0' />
				)}
				{!profile.profilePic?.isBlank && profile.profilePic ? (
					<Image
						source={{ uri: profile.profilePic }}
						className='rounded-full w-full h-full'
					/>
				) : (
					<View className='rounded-full w-full h-full bg-dark-secondaryBackground flex items-center justify-center'>
						<Text className='text-dark-textColor text-4xl font-inter-bold text-center pt-1'>
							{profile.fullName?.split(' ').map((n) => n[0])}
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
		</Pressable>
	);
};

type ProfileComponentSkeletonProps = {
	width: number;
};

export const ProfileComponentSkeleton = ({
	width,
}: ProfileComponentSkeletonProps) => {
	return (
		<View className='items-center'>
			<Skeleton
				width={width}
				height={width}
				animation='wave'
				circle
				style={{
					backgroundColor: themeColors[mode].secondaryBackground,
					marginBottom: 4,
				}}
				skeletonStyle={{
					backgroundColor: themeColors[mode].subTextColor,
					opacity: 0.05,
				}}
			/>
			<Skeleton
				width={width}
				height={12}
				animation='wave'
				style={{
					backgroundColor: themeColors[mode].secondaryBackground,
				}}
				skeletonStyle={{
					backgroundColor: themeColors[mode].subTextColor,
					opacity: 0.05,
				}}
			/>
		</View>
	);
};

export default ProfileComponent;
