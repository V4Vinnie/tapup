import { FlatList, View } from 'react-native';
import { TChapter, TUser } from '../types';
import PreviewComponent from './PreviewComponent';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useTaps } from '../providers/TapProvider';
import { useIsFocused } from '@react-navigation/native';
import { getProgessForChapters } from '../database/services/MockTapService';
import LoadingIndicator from './LoadingIndicator';
import ChapterComponent from './ChapterComponent';

type Props = {
	chapters: TChapter[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 10;
const ChapterList = ({ chapters, containerProps }: Props) => {
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TUser) => {
			getProgessForChapters(user, chapters).then((progress) => {
				if (progress) setProgress(progress);
				setLoaded(true);
			});
		};
		if (isFocused) getProgress(user);
		onUser(user.uid, getProgress);
	}, [isFocused, user, chapters]);

	return !loaded ? (
		<LoadingIndicator /> // TODO: Add Skeleton Loading
	) : (
		<View className='w-full px-4' {...containerProps}>
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
						key={chapter.id}
						episodeNumber={index + 1}
						progress={progress.get(chapter.id)}
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
		</View>
	);
};

export default ChapterList;
