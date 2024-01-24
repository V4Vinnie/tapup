import { View, Text } from 'react-native';
import React from 'react';
import { TProfile } from '../types';
import ProfileComponent from './ProfileComponent';

type Props = {
	profile: TProfile;
};

const ProfileHeader = ({ profile }: Props) => {
	return (
		<View className='flex flex-col items-center w-full space-y-2'>
			<ProfileComponent profile={profile} showName={false} />
			<Text
				numberOfLines={1}
				className='text-dark-textColor text-2xl font-inter-semiBold mt-2'>
				{profile.name}
			</Text>
			<View className='flex flex-row pr-6 mr-px'>
				<ProfileDetail topText='400' bottomText='Followers' />
				<ProfileDetail topText='100' bottomText='Following' />
				<ProfileDetail topText='180K' bottomText='Likes' last />
			</View>
		</View>
	);
};

type ProfileDetailProps = {
	topText: string;
	bottomText: string;
	last?: boolean;
};

const ProfileDetail = ({
	topText,
	bottomText,
	last = false,
}: ProfileDetailProps) => {
	return (
		<View className='flex flex-row items-center'>
			<View className={`flex flex-col items-center px-6`}>
				<Text className='text-dark-textColor text-sm font-inter-semiBold'>
					{topText}
				</Text>
				<Text className='text-dark-subTextColor text-xs font-inter-regular'>
					{bottomText}
				</Text>
			</View>
			{!last && <View className='w-px h-6 bg-dark-textColor/30' />}
		</View>
	);
};

export default ProfileHeader;
