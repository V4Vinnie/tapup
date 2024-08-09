import { Image, ScrollView, View } from 'react-native';
import { TChapter, TProfile, TStory } from '../types';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ChapterComponent, { ChapterComponentSkeleton } from './ChapterComponent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';

type Props = {
	chapters: TChapter[];
	containerProps?: View['props'];
	loading?: boolean;
	chapterProgress?: Record<string, number>;
};

const SPACE_BETWEEN = 10;
const ChapterList = ({
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
	const [loaded, setLoaded] = useState(false);
	const [imagesLoading, setImagesLoading] = useState<boolean>(true);

	useEffect(() => {
		const imageUrls = chapters.map((chapter) => {
			if (chapter.frames[0].type === 'PHOTO') {
				return Image.prefetch(chapter.frames[0].image);
			}
		});
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [chapters]);

	const dataLoading = useMemo(() => {
		return imagesLoading || !loaded || loading;
	}, [imagesLoading, loaded, loading]);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TProfile) => {
			const progress = user.progress;
			if (progress) setProgress(progress);
			setLoaded(true);
		};
		if (isFocused) getProgress(user);
		const sub = onUser(user.uid, getProgress);
		return () => (sub ? sub() : undefined);
	}, [isFocused, user, chapters]);

	return dataLoading ? (
		<ChapterRowSkeleton />
	) : (
		<ScrollView className='w-full px-4' {...containerProps}>
			{chapters.map((chapter, index) => {
				if (!chapter) return null;
				const video =
					chapter.frames[0].type === 'VIDEO'
						? chapter.frames[0].video
						: undefined;
				const thumbnail =
					chapter.frames[0].type === 'PHOTO'
						? chapter.frames[0].image
						: undefined;
				const progressForChapter = progress[chapter.chapterId] ?? 0;
				const chapterProcessInPercent =
					(progressForChapter / chapter.frames.length) * 100;

				return (
					<ChapterComponent
						key={chapter.chapterId}
						onPress={() => {
							navigate(Routes.STORY_VIEWER, {
								chapter,
							});
						}}
						episodeNumber={index + 1}
						progress={chapterProcessInPercent}
						text={chapter.name}
						thumbnail={thumbnail}
						video={video}
						fullChapter={chapter}
						containerProps={{
							style: {
								marginBottom:
									index === chapters.length - 1
										? 0
										: SPACE_BETWEEN,
							},
						}}
					/>
				);
			})}
		</ScrollView>
	);
};

const ChapterRowSkeleton = () => {
	return (
		<View className='w-full px-4'>
			{[1, 2].map((chapter, index) => {
				if (!chapter) return null;

				return (
					<View
						key={chapter}
						className='pr-4'
						style={{
							marginBottom: index === 4 ? 0 : SPACE_BETWEEN,
						}}>
						<ChapterComponentSkeleton />
					</View>
				);
			})}
		</View>
	);
};

export default ChapterList;
