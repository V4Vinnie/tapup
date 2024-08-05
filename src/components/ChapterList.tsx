import { Image, ScrollView, View } from 'react-native';
import { TChapter, TProfile, TStory } from '../types';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useIsFocused } from '@react-navigation/native';
import { getProgressForChapters } from '../database/services/TapService';
import ChapterComponent, { ChapterComponentSkeleton } from './ChapterComponent';
import { makeStoriesFromChapters } from '../utils/storyUtils';

type Props = {
	chapters: TChapter[];
	containerProps?: View['props'];
	loading?: boolean;
	chapterProgress?: Map<string, number>;
};

const SPACE_BETWEEN = 10;
const ChapterList = ({
	chapters,
	containerProps,
	loading,
	chapterProgress,
}: Props) => {
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = useState<Map<string, number>>(
		chapterProgress ?? new Map()
	);
	const [loaded, setLoaded] = useState(false);
	const [imagesLoading, setImagesLoading] = useState<boolean>(true);
	const [stories, setStories] = useState<TStory[]>([]);

	useEffect(() => {
		const imageUrls = chapters.map((chapter) => {
			if (chapter.frames[0].media) {
				return Image.prefetch(chapter.frames[0].media);
			}
		});
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [chapters]);

	useEffect(() => {
		makeStoriesFromChapters(chapters).then((stories) =>
			setStories(stories)
		);
	}, [chapters]);

	const dataLoading = useMemo(() => {
		return imagesLoading || !loaded || loading;
	}, [imagesLoading, loaded, loading]);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TProfile) => {
			const progress = getProgressForChapters(user, chapters);
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
					chapter.frames[0].mediaType === 'VIDEO'
						? chapter.frames[0].media
						: undefined;
				const thumbnail =
					chapter.frames[0].mediaType === 'IMAGE'
						? chapter.frames[0].media
						: undefined;

				return (
					<ChapterComponent
						key={chapter.chapterId}
						// TODO LINK TO CHAPTER VIEWER
						onPress={() => {}}
						episodeNumber={index + 1}
						progress={progress.get(chapter.chapterId)}
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
