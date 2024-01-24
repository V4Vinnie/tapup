import { Image, Text, View } from 'react-native';
import { themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthProvider';
import Video from 'react-native-video';

type Props = {
	thumbnail?: string;
	video?: string;
	text: string;
	progress?: number;
	containerProps?: View['props'];
};

const PreviewComponent = ({
	thumbnail,
	video,
	text,
	progress,
	containerProps,
}: Props) => {
	const { user } = useAuth();

	return (
		<View
			className='w-32 h-44 rounded-lg overflow-hidden'
			{...containerProps}>
			{thumbnail && (
				<Image source={{ uri: thumbnail }} className='w-full h-full' />
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
				{text}
			</Text>
			{progress && (
				<View className='absolute bottom-0 w-full h-1 bg-dark-secondaryBackground'>
					<View
						className='h-full'
						style={{
							width: `${progress}%`,
							backgroundColor: themeColors.primaryColor[100],
						}}
					/>
				</View>
			)}
		</View>
	);
};

export default PreviewComponent;
