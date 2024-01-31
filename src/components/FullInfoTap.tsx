import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { TTap, TTopic } from '../types';
import { mode, themeColors } from '../utils/constants';
import { getCreatorName } from '../database/services/ProfileService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Logo from '../../assets/images/Logo';
import {
	getTopicFromTap,
	getViewsForTap,
} from '../database/services/TapService';
import { Skeleton } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { useTaps } from '../providers/TapProvider';

type Props = {
	tap?: TTap;
	isNew?: boolean;
	containerProps?: View['props'];
	loading?: boolean;
};

const FullInfoTap = ({ tap, containerProps, isNew, loading }: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { taps } = useTaps();
	const [views, setViews] = React.useState<string>('0');
	const [topic, setTopic] = React.useState<TTopic | null>(null);
	const [companyName, setCompanyName] = React.useState<string>('');
	useEffect(() => {
		if (!tap) return;
		const getCompanyName = async () => {
			const _companyName = await getCreatorName(tap.creatorId);
			if (!_companyName) return;
			setCompanyName(_companyName);
		};
		getCompanyName();
	}, [tap]);

	const timeAgo = useMemo(() => {
		if (!tap) return '';
		const dateInSeconds = Math.floor(
			(new Date().valueOf() -
				new Date(tap.createdAt.toDate()).valueOf()) /
				1000
		);
		const oneDayInSeconds = 86400;
		const daysAgo = (dateInSeconds / oneDayInSeconds) | 0;
		if (daysAgo === 0) return 'Today';
		if (daysAgo === 1) return 'Yesterday';
		if (daysAgo < 7) return `${daysAgo} days ago`;
		if (daysAgo < 30) return `${(daysAgo / 7) | 0} weeks ago`;
		if (daysAgo < 365) return `${(daysAgo / 30) | 0} months ago`;
		return `${(daysAgo / 365) | 0} years ago`;
	}, [tap]);

	useEffect(() => {
		if (!tap) return;
		getViewsForTap(tap.id).then((views) => {
			if (!views) return;
			const viewsString = views.toString();
			setViews(
				viewsString.length > 3
					? `${viewsString.slice(0, -3)}K`
					: viewsString
			);
		});
		getTopicFromTap(tap).then((topic) => {
			if (!topic) return;
			setTopic(topic);
		});
	}, [tap]);

	return loading || !tap || !topic ? (
		<FullInfoTapSkeleton />
	) : (
		<TouchableOpacity
			className='w-full flex flex-row'
			{...containerProps}
			onPress={() =>
				navigate(Routes.TAP_SCREEN, {
					initialTap: tap,
					selectedTopic: topic,
				})
			}>
			{isNew && (
				<Text className='absolute right-0 top-0 px-2 py-[2px] bg-primaryColor-100 rounded-sm text-white text-xs font-inter-medium'>
					New
				</Text>
			)}
			<Image
				source={{ uri: tap.thumbnail }}
				className='w-20 h-28 rounded-md mr-2'
			/>
			<View className='flex justify-between shrink'>
				<View className='flex flex-col'>
					<Text
						numberOfLines={1}
						className='text-dark-textColor text-base font-inter-medium w-4/5'>
						{tap.fullName}
					</Text>
					<View className='flex flex-row space-x-1 items-center'>
						<FontAwesome5
							name='chevron-right'
							size={9}
							color={themeColors.primaryColor[100]}
						/>
						<Text className='text-dark-subTextColor text-[12px] font-inter-regular'>
							{companyName}
						</Text>
					</View>
				</View>
				<Text
					numberOfLines={2}
					className='text-dark-subTextColor text-[10px] font-inter-light'>
					{tap.description}
				</Text>
				<View className='flex flex-row items-center gap-3'>
					<Text className='text-dark-subTextColor text-[10px] font-inter-light'>
						{views} view{views === '1' ? '' : 's'}
					</Text>
					<View className='w-1 h-2'>
						<Logo scale={0.05} width={6} height={10} />
					</View>
					<Text className='text-dark-subTextColor text-[10px] font-inter-light'>
						{timeAgo}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const FullInfoTapSkeleton = () => {
	return (
		<View className='w-full flex flex-row mb-4'>
			<Skeleton
				animation='wave'
				width={80}
				height={112}
				style={{
					borderRadius: 8,
					marginRight: 8,
					backgroundColor: themeColors[mode].secondaryBackground,
				}}
				skeletonStyle={{
					backgroundColor: themeColors[mode].subTextColor,
					opacity: 0.05,
				}}
			/>
			<View className='flex justify-between shrink'>
				<View className='flex flex-col'>
					<Skeleton
						animation='wave'
						width={250}
						height={16}
						style={{
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
						}}
					/>
					<Skeleton
						animation='wave'
						width={100}
						height={12}
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
				<View className='flex flex-col space-y-1'>
					<Skeleton
						animation='wave'
						width={250}
						height={10}
						style={{
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
							marginTop: 4,
						}}
					/>
					<Skeleton
						animation='wave'
						width={220}
						height={10}
						style={{
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
							marginTop: 2,
						}}
					/>
				</View>
				<Skeleton
					animation='wave'
					width={250}
					height={12}
					style={{
						backgroundColor: themeColors[mode].secondaryBackground,
					}}
					skeletonStyle={{
						backgroundColor: themeColors[mode].subTextColor,
						opacity: 0.05,
						marginTop: 6,
					}}
				/>
			</View>
		</View>
	);
};

export default FullInfoTap;
