import { Image, Text, View } from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthProvider';
import Video from 'react-native-video';
import { Skeleton } from '@rneui/themed';

type Props = {
	thumbnail?: string;
	video?: string;
	text?: string;
	showProgress?: boolean;
	progress?: number;
	containerProps?: View['props'];
	loading?: boolean;
};

const PreviewComponent: React.FC<Props> = ({
	thumbnail,
	video,
	text,
	showProgress = true,
	progress,
	containerProps,
	loading,
}: Props) => {
	return loading ? (
		<PreviewComponentSkeleton />
	) : (
		<View
			className='w-32 h-44 rounded-lg overflow-hidden'
			{...containerProps}>
			{thumbnail === '' ? (
				<View className='w-full h-full bg-dark-secondaryBackground' />
			) : (
				<Image
					source={{ uri: thumbnail }}
					className='w-full h-full bg-dark-secondaryBackground'
				/>
			)}
			{!thumbnail && video && (
				<Video
					source={{ uri: video }} // Can be a URL or a local file.
					paused={true}
					controls={false}
				/>
			)}
			<LinearGradient
				className='absolute bottom-0 w-full h-1/2'
				colors={['transparent', 'rgba(0,0,0,1)']}
			/>
			<Text
				numberOfLines={1}
				className='absolute bottom-0 w-full h-5 mb-2 px-2 flex flex-row justify-between items-center text-white text-left text-xs font-inter-medium'>
				{text ?? 'Loading...'}
			</Text>
			{showProgress && (
				<View className='absolute bottom-0 w-full h-1 bg-dark-secondaryBackground'>
					{!progress ? (
						<Skeleton
							animation='wave'
							style={{
								width: `100%`,
								backgroundColor:
									themeColors[mode].secondaryBackground,
							}}
							skeletonStyle={{
								backgroundColor: themeColors[mode].subTextColor,
								opacity: 0.1,
							}}
						/>
					) : (
						<View
							className='h-full w-full bg-primaryColor-100'
							style={{
								width: `${progress}%`,
							}}
						/>
					)}
				</View>
			)}
		</View>
	);
};

const PreviewComponentSkeleton = () => {
	return (
		<Skeleton
			width={128}
			height={176}
			animation='wave'
			style={{
				borderRadius: 8,
				backgroundColor: themeColors[mode].secondaryBackground,
			}}
			skeletonStyle={{
				backgroundColor: themeColors[mode].subTextColor,
				opacity: 0.05,
			}}
		/>
	);
};

export default PreviewComponent;
