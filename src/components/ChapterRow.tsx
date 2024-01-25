import { FlatList, Image, View } from 'react-native';
import { TChapter, TUser } from '../types';
import PreviewComponent from './PreviewComponent';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useIsFocused } from '@react-navigation/native';
import { getProgessForChapters } from '../database/services/MockTapService';

type Props = {
	chapters?: TChapter[];
	containerProps?: View['props'];
	loading?: boolean;
};

const SPACE_BETWEEN = 10;
const ChapterRow = ({ chapters, containerProps, loading }: Props) => {
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const [imagesLoading, setImagesLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TUser) => {
			if (!chapters) return;
			getProgessForChapters(user, chapters).then((progress) => {
				if (progress) setProgress(progress);
			});
		};
		if (isFocused) getProgress(user);
		onUser(user.uid, getProgress);
	}, [isFocused, user, chapters]);

	useEffect(() => {
		if (!chapters) return;
		const imageUrls = chapters.map((chapter) =>
			Image.prefetch(chapter.frames[0].media)
		);
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [chapters]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loading;
	}, [imagesLoading, loading]);

	return dataLoading || !chapters ? (
		<ChapterRowSkeleton />
	) : (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={chapters}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
				}}
				renderItem={({ item, index }) => {
					const video =
						item.frames[0].mediaType === 'VIDEO'
							? item.frames[0].media
							: undefined;
					const thumbnail =
						item.frames[0].mediaType === 'IMAGE'
							? item.frames[0].media
							: undefined;
					return (
						<PreviewComponent
							progress={progress.get(item.id)}
							text={item.name}
							video={video}
							thumbnail={thumbnail}
							containerProps={{
								style: {
									marginRight:
										index === chapters.length - 1
											? 0
											: SPACE_BETWEEN,
								},
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
				renderItem={({ item, index }) => <PreviewComponent loading />}
			/>
		</View>
	);
};

export default ChapterRow;
