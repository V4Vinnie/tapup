import { View, Text } from 'react-native';
import React from 'react';
import { TProfile } from '../types';
import ProfileComponent, { ProfileComponentSkeleton } from './ProfileComponent';
import { Skeleton } from '@rneui/themed';
import { mode, themeColors } from '../utils/constants';

type Props = {
	profile: TProfile;
	showDetails?: boolean;
};

const ProfileHeader = ({ profile, showDetails = true }: Props) => {
	const [loading, setLoading] = React.useState<boolean>(true);
	const [followerAmount, setFollowerAmount] = React.useState<string>('');
	const [followingAmount, setFollowingAmount] = React.useState<string>('');
	const [likesAmount, setLikesAmount] = React.useState<string>('');

	// TODO: Fetch data
	React.useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setFollowerAmount('400');
			setFollowingAmount('100');
			setLikesAmount('180K');
			setLoading(false);
		}, 1000);
	}, [profile]);

	return (
		<View className='flex flex-col items-center w-full space-y-2'>
			<ProfileComponent profile={profile} showName={false} />
			<Text
				numberOfLines={1}
				className='text-dark-textColor text-2xl font-inter-semiBold mt-2'>
				{profile.name}
			</Text>
			{/* {showDetails && (
				<ProfileDetails
					followerAmount={followerAmount}
					followingAmount={followingAmount}
					likesAmount={likesAmount}
					loading={loading}
				/>
			)} */}
		</View>
	);
};

type ProfileDetailsProps = {
	followerAmount: string;
	followingAmount: string;
	likesAmount: string;
	loading?: boolean;
};

const ProfileDetails = ({
	followerAmount,
	followingAmount,
	likesAmount,
	loading,
}: ProfileDetailsProps) => {
	return (
		<View className='flex flex-row space-x-6'>
			<ProfileDetail
				topText={followerAmount}
				bottomText='Followers'
				loading={loading}
			/>
			<ProfileDetail
				topText={followingAmount}
				bottomText='Following'
				loading={loading}
			/>
			<ProfileDetail
				topText={likesAmount}
				bottomText='Likes'
				loading={loading}
				last
			/>
		</View>
	);
};

type ProfileDetailProps = {
	topText: string;
	bottomText: string;
	last?: boolean;
	loading?: boolean;
};

const ProfileDetail = ({
	topText,
	bottomText,
	last = false,
	loading,
}: ProfileDetailProps) => {
	return loading ? (
		<View className='flex flex-row items-center mt-1 -mr-1'>
			<View className={`flex flex-col items-center px-6`}>
				<View className='flex flex-col items-center w-16'>
					<Skeleton
						width={32}
						height={16}
						animation='wave'
						style={{
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
							marginTop: 10,
						}}
					/>
					<Skeleton
						width={50}
						height={10}
						animation='wave'
						style={{
							backgroundColor:
								themeColors[mode].secondaryBackground,
							marginTop: 4,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
						}}
					/>
				</View>
			</View>
			{!last && <View className='w-px h-6 bg-dark-textColor/30' />}
		</View>
	) : (
		<View className='flex flex-row items-center'>
			<View className={`flex flex-col items-center px-6`}>
				<Text className='text-dark-textColor text-center text-sm font-inter-semiBold w-14'>
					{topText}
				</Text>
				<Text className='text-dark-subTextColor text-center text-xs font-inter-regular w-14'>
					{bottomText}
				</Text>
			</View>
			{!last && <View className='w-px h-6 bg-dark-textColor/30' />}
		</View>
	);
};

export const ProfileHeaderSkeleton = () => {
	return (
		<View className='flex flex-col items-center w-full space-y-2'>
			<ProfileComponentSkeleton width={64} />
			<Skeleton
				width={200}
				height={24}
				animation='wave'
				style={{
					backgroundColor: themeColors[mode].secondaryBackground,
				}}
				skeletonStyle={{
					backgroundColor: themeColors[mode].subTextColor,
					opacity: 0.05,
				}}
			/>
			<View className='flex flex-row space-x-6'>
				<ProfileDetail bottomText='' topText='' loading />
				<ProfileDetail bottomText='' topText='' loading />
				<ProfileDetail bottomText='' topText='' loading last />
			</View>
		</View>
	);
};

export default ProfileHeader;
