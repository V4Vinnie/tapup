import {
	GestureResponderEvent,
	Image,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { TChapter } from '../types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Skeleton } from '@rneui/themed';
import CustomStory from './Custom/CustomStory';
// import { useVideoPlayer, VideoView } from 'expo-video';
import Video from './Video';
import { useCompany } from '../providers/CompanyProvider';

type Props = {
	episodeNumber: number;
	thumbnail?: string;
	video?: string;
	text: string;
	showProgress?: boolean;
	progress?: number;
	containerProps?: View['props'];
	fullChapter: TChapter;
	loading?: boolean;
	onPress: (event: GestureResponderEvent) => void;
};

const ChapterComponent = ({
	episodeNumber,
	thumbnail,
	video,
	text,
	showProgress = true,
	progress = 0,
	fullChapter,
	containerProps,
	onPress,
}: Props) => {
	const { user } = useAuth();
	const { companyColor } = useCompany();

	const [views, setViews] = useState<string>('0');

	const timeAgo = useMemo(() => {
		if (!fullChapter) return '';
		const dateInSeconds = Math.floor(
			(new Date().valueOf() -
				new Date(
					fullChapter.frames[
						fullChapter.frames.length - 1
					].createdAt.toDate()
				).valueOf()) /
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

		// TODO: Replace with react-time-ago
	}, [fullChapter]);

	useEffect(() => {
		if (!fullChapter) return;
		const views = fullChapter.frames.reduce((acc, frame) => {
			return acc + (frame.watchedBy ?? []).length;
		}, 0);
		const viewsString = views.toString();
		setViews(
			viewsString.length > 3
				? `${viewsString.slice(0, -3)}K`
				: viewsString
		);
	}, [fullChapter]);

	return (
		<TouchableOpacity
			className='w-full flex-row space-x-4'
			{...containerProps}
			onPress={onPress}>
			<View
				className='w-24 h-16 rounded-lg overflow-hidden'
				{...containerProps}>
				{thumbnail?.isBlank ? (
					<View className='w-full h-full bg-dark-secondaryBackground' />
				) : (
					<Image
						source={{ uri: thumbnail ?? '' }}
						className='w-full h-full bg-dark-secondaryBackground'
					/>
				)}
				{!thumbnail && video && <Video video={video ?? ''} />}
				{showProgress && (
					<View className='absolute bottom-0 w-full h-1 bg-dark-secondaryBackground'>
						<View
							className='h-full w-full'
							style={{
								width: `${progress}%`,
								backgroundColor: companyColor,
							}}
						/>
					</View>
				)}
				<View
					className='absolute top-1 right-1 px-2 py-px rounded-md'
					style={{
						backgroundColor: companyColor,
					}}>
					<Text className='text-white text-[10px] font-inter-semiBold'>
						EP {episodeNumber}
					</Text>
				</View>
			</View>
			<View className='flex grow justify-between'>
				<View className='flex flex-col space-y-1 grow'>
					<View className='flex flex-row justify-between'>
						<Text
							numberOfLines={1}
							className='text-white text-left text-sm font-inter-medium w-1/2'>
							{text}
						</Text>
						<Text className='text-dark-subTextColor text-[10px] font-inter-regular'>
							{timeAgo}
						</Text>
					</View>
					<Text className='text-dark-subTextColor text-[10px] font-inter-regular'>
						{views} views
					</Text>
				</View>
				<View className='flex self-end mb-3'>
					<AntIcon name='arrowright' size={20} color={companyColor} />
				</View>
			</View>
		</TouchableOpacity>
	);
};

export const ChapterComponentSkeleton = () => {
	return (
		<View className='w-full flex-row space-x-4'>
			<View className='w-24 h-16 rounded-lg overflow-hidden'>
				<Skeleton
					animation='wave'
					width={96}
					height={64}
					style={{
						borderRadius: 8,
						backgroundColor: themeColors[mode].secondaryBackground,
					}}
					skeletonStyle={{
						backgroundColor: themeColors[mode].subTextColor,
						opacity: 0.05,
					}}
				/>
			</View>
			<View className='flex grow justify-between'>
				<View className='flex flex-col space-y-1 grow'>
					<View className='flex flex-row justify-between'>
						<Skeleton
							animation='wave'
							width={96}
							height={16}
							style={{
								borderRadius: 2,
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
							width={40}
							height={16}
							style={{
								borderRadius: 2,
								backgroundColor:
									themeColors[mode].secondaryBackground,
							}}
							skeletonStyle={{
								backgroundColor: themeColors[mode].subTextColor,
								opacity: 0.05,
							}}
						/>
					</View>
					<Skeleton
						animation='wave'
						width={40}
						height={10}
						style={{
							borderRadius: 2,
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
						}}
					/>
				</View>
				<View className='flex self-end mb-3'>
					<Skeleton
						animation='wave'
						width={24}
						height={20}
						style={{
							borderRadius: 2,
							backgroundColor:
								themeColors[mode].secondaryBackground,
						}}
						skeletonStyle={{
							backgroundColor: themeColors[mode].subTextColor,
							opacity: 0.05,
						}}
					/>
				</View>
			</View>
		</View>
	);
};

export default ChapterComponent;
