import { FlatList, Image, View } from 'react-native';
import { TChapter, TProfile, TStory } from '../types';
import PreviewComponent from './PreviewComponent';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SKELETON_WAIT_TIME } from '../utils/constants';
import { makeStoriesFromChapters } from '../utils/storyUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';
import { generatePreviewPhoto } from '../utils/getThumbnailFromVideo';

type Props = {
	chapters?: TChapter[];
	containerProps?: View['props'];
	loading?: boolean;
	chapterProgress?: Record<string, number>;
};

const SPACE_BETWEEN = 10;
const ChapterRow = ({
	chapters,
	containerProps,
	loading,
	chapterProgress,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = useState<Record<string, number>>(
		chapterProgress ?? {}
	);
	const [imagesLoading, setImagesLoading] = useState<boolean>(true);
	const [loadingAll, setLoadingAll] = useState<boolean>(true);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TProfile) => {
			if (!chapters) return;
			const progress = user.progress;
			if (progress) setProgress(progress);
		};
		if (isFocused) getProgress(user);
		const sub = onUser(user.uid, getProgress);
		return () => (sub ? sub() : undefined);
	}, [isFocused, user, chapters]);

	useEffect(() => {
		if (!chapters) return;
		const imageUrls = chapters.map(async (chapter) => {
			if (chapter.frames[0].type === 'PHOTO') {
				return Image.prefetch(chapter.frames[0].image);
			}
			if (chapter.frames[0].type === 'VIDEO') {
				const video = await generatePreviewPhoto(
					chapter.frames[0].video
				);
				if (video) {
					return Image.prefetch(video);
				}
			}
		});
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [chapters]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loading;
	}, [imagesLoading, loading]);

	useEffect(() => {
		if (!(dataLoading || !chapters)) {
			setTimeout(() => setLoadingAll(false), SKELETON_WAIT_TIME);
		}
	}, [dataLoading, chapters]);

	return loadingAll || !chapters ? (
		<ChapterRowSkeleton />
	) : (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={chapters}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.chapterId}
				contentContainerStyle={{
					paddingHorizontal: 16,
				}}
				renderItem={({ item, index }) => {
					return (
						<PreviewComponent
							key={item.chapterId}
							progress={progress[item.chapterId]}
							text={item.name}
							chapter={item}
							containerProps={{
								style: {
									marginRight:
										index === chapters!.length - 1
											? 0
											: SPACE_BETWEEN,
								},
							}}
							onPress={() => {
								navigate(Routes.STORY_VIEWER, {
									chapter: item,
								});
							}}
						/>
					);
				}}
			/>
		</View>
	);
};

const ChapterRowSkeleton = () => {
	return (
		<View className='w-full'>
			<FlatList
				horizontal
				data={[1, 2, 3, 4, 5]}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.toString()}
				contentContainerStyle={{
					paddingHorizontal: 16,
					columnGap: SPACE_BETWEEN,
				}}
				renderItem={({ item, index }) => (
					<PreviewComponent key={item} loading />
				)}
			/>
		</View>
	);
};

export default ChapterRow;
