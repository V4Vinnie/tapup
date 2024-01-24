import { View, Text, Image } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { TTap } from '../types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { themeColors } from '../utils/constants';
import { getCompanyName } from '../database/services/MockProfileService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Logo from '../../assets/images/Logo';
import { getViewsForTap } from '../database/services/MockTapService';

type Props = {
	tap: TTap;
	isNew?: boolean;
	containerProps?: View['props'];
};

const FullInfoTap = ({ tap, containerProps, isNew }: Props) => {
	const [views, setViews] = React.useState<string>('0');
	const companyName = useMemo(() => {
		return getCompanyName(tap.creatorId);
	}, [tap]);

	const timeAgo = useMemo(() => {
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
		getViewsForTap(tap.id).then((views) => {
			if (!views) return;
			const viewsString = views.toString();
			setViews(
				viewsString.length > 3
					? `${viewsString.slice(0, -3)}K`
					: viewsString
			);
		});
	}, [tap]);

	return (
		<View className='w-full flex flex-row' {...containerProps}>
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
						{tap.name}
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
						{views} views
					</Text>
					<View className='w-1 h-2'>
						<Logo scale={0.05} width={6} height={10} />
					</View>
					<Text className='text-dark-subTextColor text-[10px] font-inter-light'>
						{timeAgo}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default FullInfoTap;
