import {
	GestureResponderEvent,
	Image,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import Video from 'react-native-video';
import { Skeleton } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { TTap, TTopic } from '../types';
import { useEffect, useState } from 'react';
import { getTopicFromTap } from '../database/services/TapService';

type Props = {
	onPress?: () => void;
	thumbnail?: string;
	video?: string;
	text?: string;
	showProgress?: boolean;
	progress?: number;
	fullTap?: TTap;
	containerProps?: View['props'];
	loading?: boolean;
};

const PreviewComponent: React.FC<Props> = ({
	onPress,
	thumbnail,
	video,
	text,
	showProgress = true,
	progress,
	fullTap,
	containerProps,
	loading,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [topic, setTopic] = useState<TTopic | null>(null);

	useEffect(() => {
		if (!fullTap) return;
		const getTopic = async () => {
			const topic = await getTopicFromTap(fullTap);
			if (!topic) return;
			setTopic(topic);
		};
		getTopic();
	}, [fullTap]);

	function handleOnPress(event: GestureResponderEvent) {
		fullTap &&
			topic &&
			navigate(Routes.TAP_SCREEN, {
				initialTap: fullTap,
				selectedTopic: topic,
			});
		onPress && onPress();
	}

	return loading ? (
		<PreviewComponentSkeleton />
	) : (
		<TouchableOpacity
			onPress={handleOnPress}
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
					{progress === undefined ? (
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
		</TouchableOpacity>
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
