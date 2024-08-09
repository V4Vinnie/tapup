import {
	GestureResponderEvent,
	Image,
	Text,
	Pressable,
	View,
} from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { TChapter, TTap, TTopic } from '../types';
import { useEffect, useState } from 'react';
import { getTopicFromTap } from '../database/services/TapService';
import PlaceholderImage from '../../assets/images/login_header_1.png';
import { generatePreviewPhoto } from '../utils/getThumbnailFromVideo';
import { useCompany } from '../providers/CompanyProvider';
import { useTopics } from '../providers/TopicProvider';

type Props = {
	onPress?: () => void;
	thumbnail?: string;
	chapter?: TChapter;
	video?: string;
	text?: string;
	showProgress?: boolean;
	progress?: number;
	fullTap?: TTap;
	containerProps?: View['props'];
	loading?: boolean;
};

const ChapterRowComponent = ({
	onPress,
	thumbnail,
	chapter,
	text,
	showProgress = true,
	progress,
	fullTap,
	containerProps,
	loading,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { companyColor } = useCompany();
	const { topics } = useTopics();

	const [topic, setTopic] = useState<TTopic | null>(null);
	const [previewPhoto, setPreviewPhoto] = useState<string>(
		thumbnail ?? Image.resolveAssetSource(PlaceholderImage).uri
	);

	function handleOnPress(event: GestureResponderEvent) {
		fullTap &&
			topic &&
			navigate(Routes.TAP_SCREEN, {
				initialTap: fullTap,
				selectedTopic: topic,
			});
		onPress && onPress();
	}

	const getPreviewPhoto = async (
		chapter: TChapter,
		frameIndex: number
	): Promise<string | undefined> => {
		if (!chapter) return undefined;

		switch (chapter.frames[frameIndex].type) {
			case 'PHOTO':
				return chapter.frames[frameIndex].image;
			case 'VIDEO':
				const videoPreviewPhoto = await generatePreviewPhoto(
					chapter.frames[frameIndex].video
				);
				return videoPreviewPhoto;
			case 'PHOTO_QUESTION':
				return chapter.frames[frameIndex].image;
			default:
				if (!chapter.frames[frameIndex + 1]) return undefined;
				return getPreviewPhoto(chapter, frameIndex + 1);
		}
	};

	useEffect(() => {
		if (!fullTap) return;
		const getTopic = async () => {
			const topic = getTopicFromTap(fullTap, topics);
			if (!topic) return;
			setTopic(topic);
		};
		getTopic();
	}, [fullTap]);

	useEffect(() => {
		if (thumbnail) {
			setPreviewPhoto(thumbnail);
			return;
		}
		const getPreviewPhotoFromVideo = async () => {
			if (!chapter) return;
			const previewPhoto = await getPreviewPhoto(chapter, 0);
			if (previewPhoto) setPreviewPhoto(previewPhoto);
		};
		getPreviewPhotoFromVideo();
	}, [chapter]);

	return loading ? (
		<ChapterRowComponentSkeleton />
	) : (
		<Pressable
			onPress={handleOnPress}
			className='w-32 h-44 rounded-lg overflow-hidden'
			{...containerProps}>
			<Image
				source={{ uri: previewPhoto }}
				className='w-full h-full bg-dark-secondaryBackground'
			/>
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
					<View
						className='h-full w-full'
						style={{
							width: `${progress ?? 0}%`,
							backgroundColor: companyColor,
						}}
					/>
				</View>
			)}
		</Pressable>
	);
};

const ChapterRowComponentSkeleton = () => {
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

export default ChapterRowComponent;
